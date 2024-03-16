import { AfterViewInit, Component } from '@angular/core';
import { Booking } from 'src/app/models/Booking';
import { BookingService } from 'src/app/services/booking.service';
import { DepartmentService } from 'src/app/services/department.service';
import { DeskService } from 'src/app/services/desk.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements AfterViewInit{
  employeeEmail: string;
  bookings: Booking[];

  constructor(private bookingService: BookingService, private employeeService: EmployeeService, private deskService: DeskService, private departmentService: DepartmentService){

  }
  
  ngAfterViewInit(): void {
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.employeeEmail = response.email;

      this.bookingService.getBookingHistoryByEmployeeEmail(this.employeeEmail).subscribe(bookings => {
        this.bookings = bookings;

        this.bookings.forEach(booking => {
          booking.bookedDay = booking.bookedDay.split('T')[0];
          
          this.deskService.getDeskById(booking.deskId.toString()).subscribe(desk => {
            booking.desk = desk;

            this.departmentService.getDepartmentById(desk.departmentId).subscribe(department => {
              booking.department = department;
            });
          });
        });
      });
    });
  }

}
