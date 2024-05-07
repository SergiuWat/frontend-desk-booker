import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/Booking';
import { BookingData } from 'src/app/models/BookingData';
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
  currentPage = 1;
  itemsPerPage = 5;
  totalPages: number;

  selectedBookings: Booking[] = [];
  paginatedBookings: Booking[];

  constructor(private bookingService: BookingService, private employeeService: EmployeeService, private deskService: DeskService, private departmentService: DepartmentService){

  }

  ngOnInit(): void {
    this.loadBookings();
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


  loadBookings() {
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.employeeEmail = response.email;

      this.bookingService.getActiveBookingsByEmployeeEmail(this.employeeEmail).subscribe(bookings => {
        this.bookings = bookings;
        this.totalPages = Math.ceil(this.bookings.length / this.itemsPerPage);
        this.updatePaginatedBookings();
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
      this.bookingService.cancelBooking(booking.id).subscribe((response: string) =>{
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); 

        const bookingStartDate = new Date(booking.startDate);
        bookingStartDate.setHours(0, 0, 0, 0);

        if(currentDate >= bookingStartDate){

          const startDate = new Date(booking.startDate);
          currentDate.setDate(currentDate.getDate() + 1);
          const endDate = currentDate;

          const newBooking: BookingData = {
            employeeId: booking.employeeId,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            deskId: booking.deskId
          };

          this.bookingService.addBooking(newBooking).subscribe();
        }
      }
      )});

    this.selectedBookings = [];
    window.location.reload();
  }
}
