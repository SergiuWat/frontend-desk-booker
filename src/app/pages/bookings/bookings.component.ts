import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/Booking';
import { BookingService } from 'src/app/services/booking.service';
import { DepartmentService } from 'src/app/services/department.service';
import { DeskService } from 'src/app/services/desk.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  employeeEmail: string;
  bookings: Booking[];

  selectedBookings: Booking[] = [];

  constructor(private bookingService: BookingService, private employeeService: EmployeeService, private deskService: DeskService, private departmentService: DepartmentService){

  }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.employeeEmail = response.email;

      this.bookingService.getActiveBookingsByEmployeeEmail(this.employeeEmail).subscribe(bookings => {
        this.bookings = bookings;

        this.bookings.forEach(booking => {
          booking.startDate = booking.startDate.split('T')[0];
          booking.endDate = booking.endDate.split('T')[0];
          
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

  toggleSelection(checked: boolean, booking: any) {
    if (checked && !this.selectedBookings.includes(booking)) {
      this.selectedBookings.push(booking);
    } else if (!checked && this.selectedBookings.includes(booking)) {
      this.selectedBookings = this.selectedBookings.filter(selected => selected !== booking);
    }
  }

  cancelSelectedBooking() {
    this.selectedBookings.forEach(booking => {
      this.bookingService.cancelBooking(booking.id).subscribe()});

    this.selectedBookings = [];
    window.location.reload();
  }
}
