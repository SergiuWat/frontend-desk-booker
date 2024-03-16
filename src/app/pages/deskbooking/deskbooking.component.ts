import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Desk } from 'src/app/models/Desk';
import { BookingDataService } from 'src/app/services/booking-data.service';
import { BookingService } from 'src/app/services/booking.service';
import { DeskService } from 'src/app/services/desk.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-deskbooking',
  templateUrl: './deskbooking.component.html',
  styleUrls: ['./deskbooking.component.css']
})
export class DeskbookingComponent implements OnInit{

  selectedDate: Date;
  startDate: Date;
  endDate: Date;
  departmentId: number;
  isVisible: boolean = false;
  desks: Desk[];
  isDeskBookedMap: Map<number, boolean> = new Map<number, boolean>();
  bookingType: string = 'oneDay'; // Default to 'oneDay'

  constructor(private route: ActivatedRoute,
              private datePipe: DatePipe, 
              private sharedBookingData: BookingDataService, 
              private snackBar: MatSnackBar,
              private bookingService: BookingService,
              private deskService: DeskService,
              private bookingDataService: BookingDataService,
              private employeeService: EmployeeService){
    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departmentId = +params['id'];
    });
    this.isVisible = false;
  }

  handleSelectedDate() {

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (this.selectedDate >= currentDate) {
      this.sharedBookingData.bookingData.startDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      this.sharedBookingData.bookingData.endDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      this.bookingDataService.bookingData.startDate= this.sharedBookingData.bookingData.startDate;
      this.bookingDataService.bookingData.endDate= this.sharedBookingData.bookingData.endDate;
      this.updateDesks();
    } else {
      this.isVisible = false;
      this.snackBar.open('Please select a valid date', 'Close', {duration:3000})
    }
  }

  handleStartDate() {
    // Check if the start date is valid
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (this.startDate && this.startDate >= currentDate) {
        this.sharedBookingData.bookingData.startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
        this.bookingDataService.bookingData.startDate = this.sharedBookingData.bookingData.startDate;
        this.updateDesks();
    } else {
        this.isVisible = false;
        this.snackBar.open('Please select a valid start date', 'Close', { duration: 3000 });
    }
}

handleEndDate() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (this.endDate && this.endDate >= currentDate && this.endDate >= this.startDate) {
        this.sharedBookingData.bookingData.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
        this.bookingDataService.bookingData.endDate = this.sharedBookingData.bookingData.endDate;
        this.updateDesks();
    } else {
        this.isVisible = false;
        this.snackBar.open('Please select a valid end date', 'Close', { duration: 3000 });
    }
}


  isDeskBooked(desk: Desk): Observable<boolean> {
    return this.bookingService.isDeskBooked(desk.id, this.sharedBookingData.bookingData.startDate, this.sharedBookingData.bookingData.endDate);
  }

  resetDesks() {
    this.desks = [];
}


  checkDeskAvailability(deskId: number): boolean {
    return this.isDeskBookedMap.get(deskId) || false;
  }

  async addBooking(deskId:number){
    var response = await this.employeeService.getEmployeeInfo().toPromise()
    this.bookingDataService.bookingData.employeeId=response.id;
    this.bookingDataService.bookingData.deskId=deskId;
    this.bookingService.addBooking(this.bookingDataService.bookingData).subscribe();
    window.location.reload();    
  }
  

    updateDesks(){
        this.deskService.getAllDesksByDepartmentId(this.departmentId).subscribe(data => {
          this.desks = data;
          this.bookingService.getAllBookedDesksByDay(this.sharedBookingData.bookingData.startDate, this.sharedBookingData.bookingData.endDate).subscribe(bookings =>{
            this.desks.forEach(desk =>{
              var obj = bookings.find((booking) => (booking.deskId === desk.id && ( this.datePipe.transform(booking.startDate, 'yyyy-MM-dd') <= this.sharedBookingData.bookingData.endDate ) && ( this.datePipe.transform(booking.endDate, 'yyyy-MM-dd') >= this.sharedBookingData.bookingData.startDate ) && ( this.datePipe.transform(booking.startDate))))
              if(obj != undefined){
                this.isDeskBookedMap.set(desk.id, true);
              } else {
                this.isDeskBookedMap.set(desk.id, false);
              }
            })
          });
          this.isVisible = true;
        });
  }
}
