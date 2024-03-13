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
  departmentId: number;
  isVisible: boolean = false;
  desks: Desk[];
  isDeskBookedMap: Map<number, boolean> = new Map<number, boolean>();

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
      this.sharedBookingData.bookingData.bookedDay = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      this.bookingDataService.bookingData.bookedDay= this.sharedBookingData.bookingData.bookedDay;
      console.log(this.bookingDataService.bookingData);
      this.updateDeks();
    } else {
      this.isVisible = false;
      this.snackBar.open('Please select a valid date', 'Close', {duration:3000})
    }
  }

  isDeskBooked(desk: Desk): Observable<boolean> {
    return this.bookingService.isDeskBooked(desk.id, this.sharedBookingData.bookingData.bookedDay);
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

  updateDeks(){
    this.deskService.getAllDesksByDepartmentId(this.departmentId).subscribe(data => {
      this.desks = data;
      this.bookingService.getAllBookedDesksByDay(this.sharedBookingData.bookingData.bookedDay).subscribe(bookings =>{
        this.desks.forEach(desk =>{
          var obj = bookings.find((booking) => (booking.deskId === desk.id && this.datePipe.transform(booking.bookedDay, 'yyyy-MM-dd') == this.sharedBookingData.bookingData.bookedDay))
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
