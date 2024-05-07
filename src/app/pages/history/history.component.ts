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
export class HistoryComponent implements AfterViewInit {
  employeeEmail: string;
  currentPage = 1;
  itemsPerPage = 5;
  totalpages: number;
  bookings: Booking[];
  paginatedBookings: Booking[];

  constructor(private bookingService: BookingService, private employeeService: EmployeeService, private deskService: DeskService, private departmentService: DepartmentService) {

  }

  ngAfterViewInit(): void {
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.employeeEmail = response.email;

      this.bookingService.getBookingHistoryByEmployeeEmail(this.employeeEmail).subscribe(bookings => {
        this.bookings = bookings;
        this.totalpages = Math.ceil(this.bookings.length / this.itemsPerPage);
        this.updatePaginatedBookings();
        this.bookings.forEach(booking => {
          booking.startDate = booking.startDate.split('T')[0];
          booking.endDate = booking.endDate.split('T')[0];

          this.deskService.getDeskById(booking.deskId.toString()).subscribe(desk => {
            booking.desk = desk;

            this.departmentService.getDepartmentById(desk.departmentId).subscribe(department => {
              booking.department = department;
            });
          })
        })
      });
    });
  }

  updatePaginatedBookings() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBookings = this.bookings.slice(startIndex, endIndex);
  }

  nextPage() {
    this.currentPage++;
    this.updatePaginatedBookings();
  }

  prevPage() {
    this.currentPage--;
    this.updatePaginatedBookings();
  }

}
