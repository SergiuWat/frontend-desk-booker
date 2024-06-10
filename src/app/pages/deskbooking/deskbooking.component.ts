import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Desk } from 'src/app/models/Desk';
import { BookingDataService } from 'src/app/services/booking-data.service';
import { BookingService } from 'src/app/services/booking.service';
import { DeskService } from 'src/app/services/desk.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SeatsComponent } from '../seats/seats.component';
import { HolidayService } from 'src/app/services/holiday.service';


@Component({
  selector: 'app-deskbooking',
  templateUrl: './deskbooking.component.html',
  styleUrls: ['./deskbooking.component.css']
})
export class DeskbookingComponent implements OnInit {
  @ViewChild(SeatsComponent) seatsComponent: SeatsComponent;
  selectedDate: Date;
  startDate: Date;
  endDate: Date;
  departmentId: number;
  isVisible: boolean = false;
  desks: Desk[];
  bookingType: string = 'oneDay'; // Default to 'oneDay'
  deparment: string;
  floorLevel: string;
  selectedRegion = 'Romania';
  regions = ['Romania', 'Germany']; 
  holidays: Date[] = [];
  
  constructor(private route: ActivatedRoute,
    private datePipe: DatePipe,
    private sharedBookingData: BookingDataService,
    private snackBar: MatSnackBar,
    private bookingService: BookingService,
    private deskService: DeskService,
    private bookingDataService: BookingDataService,
    private employeeService: EmployeeService,
    private holidayService: HolidayService,
    private router: Router) {

  }

  async ngOnInit(){
    this.route.params.subscribe(params => {
      this.departmentId = +params['id'];
    });
    this.isVisible = false;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    this.selectedDate = currentDate;
    this.sharedBookingData.bookingData.startDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.sharedBookingData.bookingData.endDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.updateDesks();
    if (this.seatsComponent != undefined) {
      this.seatsComponent.updateSeats();
    }
    var employeeInfo = await this.employeeService.getEmployeeInfo().toPromise();
    this.deparment = employeeInfo.department.departmentName;
    this.floorLevel = employeeInfo.department.floor.floorLevel.toString();
    this.updateHolidays();
  }

  updateHolidays() {
    const currentYear = new Date().getFullYear();
    this.holidays = this.holidayService.getHolidaysForRegion(this.selectedRegion, currentYear);
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isBeforeToday = date < today;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = this.holidays.some(
      holiday => holiday.getDate() === date.getDate() &&
                 holiday.getMonth() === date.getMonth() &&
                 holiday.getFullYear() === date.getFullYear()
    );

    return !isBeforeToday && !isWeekend && !isHoliday;
  };

  handleSelectedDate() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    this.isVisible = true;
    if (this.selectedDate >= currentDate) {
      this.sharedBookingData.bookingData.startDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      this.sharedBookingData.bookingData.endDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      this.bookingDataService.bookingData.startDate = this.sharedBookingData.bookingData.startDate;
      this.bookingDataService.bookingData.endDate = this.sharedBookingData.bookingData.endDate;
      this.updateDesks();
    } else {
      this.isVisible = false;
      this.seatsComponent.resetWhenDateIsNotValid();
      this.snackBar.open('Please select a valid date', 'Close', { duration: 3000 })
    }
  }

  handleStartDate() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (this.startDate && this.startDate >= currentDate) {
      this.sharedBookingData.bookingData.startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
      this.bookingDataService.bookingData.startDate = this.sharedBookingData.bookingData.startDate;

      if (this.startDate >= this.endDate) {
        this.endDate = this.startDate;
        this.sharedBookingData.bookingData.startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
        this.sharedBookingData.bookingData.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
        this.bookingDataService.bookingData.startDate = this.sharedBookingData.bookingData.startDate;
        this.bookingDataService.bookingData.endDate = this.sharedBookingData.bookingData.endDate;
        this.updateDesks();
      } else {
        this.updateDesks();
      }
    } else {
      this.seatsComponent.resetWhenDateIsNotValid();
      this.snackBar.open('Please select a valid start date', 'Close', { duration: 3000 });
    }
  }

  handleEndDate() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (this.endDate && this.endDate >= currentDate && this.endDate >= this.startDate) {
      this.sharedBookingData.bookingData.startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
      this.sharedBookingData.bookingData.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
      this.bookingDataService.bookingData.startDate = this.sharedBookingData.bookingData.startDate;
      this.bookingDataService.bookingData.endDate = this.sharedBookingData.bookingData.endDate;
      this.updateDesks();
    } else {
      this.isVisible = false;
      this.seatsComponent.resetWhenDateIsNotValid();
      this.snackBar.open('Please select a valid end date', 'Close', { duration: 3000 });
    }
  }


  isDeskBooked(desk: Desk): Observable<boolean> {
    return this.bookingService.isDeskBooked(desk.id, this.sharedBookingData.bookingData.startDate, this.sharedBookingData.bookingData.endDate);
  }

  resetDesks() {
    this.seatsComponent.resetSeats();
    this.isVisible = true;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    this.selectedDate = currentDate;
    this.startDate = currentDate;
    this.endDate = currentDate;

    this.sharedBookingData.bookingData.startDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.sharedBookingData.bookingData.endDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

    this.bookingDataService.bookingData.startDate = this.sharedBookingData.bookingData.startDate;
    this.deskService.getAllDesksByDepartmentId(this.departmentId).subscribe(data => {
      this.desks = data;
      this.isVisible = true;
      if (this.seatsComponent !== undefined) {
        this.seatsComponent.updateSeats();
      }
    });

  }


  async addBooking(deskId: number) {
    var response = await this.employeeService.getEmployeeInfo().toPromise()
    this.bookingDataService.bookingData.employeeId = response.id;
    this.bookingDataService.bookingData.deskId = deskId;
    this.bookingService.addBooking(this.bookingDataService.bookingData).subscribe();
    window.location.reload();
  }


  updateDesks() {
    this.deskService.getAllDesksByDepartmentId(this.departmentId).subscribe(data => {
      this.desks = data;
      this.isVisible = true;
    });
  }

  goToHome(){
    this.router.navigate(['/home']);
  }

}
