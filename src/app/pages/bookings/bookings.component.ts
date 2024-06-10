import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Booking } from 'src/app/models/Booking';
import { BookingData } from 'src/app/models/BookingData';
import { BookingService } from 'src/app/services/booking.service';
import { DepartmentService } from 'src/app/services/department.service';
import { DeskService } from 'src/app/services/desk.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { CancelDialogComponent } from '../cancel-dialog/cancel-dialog.component';
import { Router } from '@angular/router';
import { CancelConfirmationComponent } from '../cancel-confirmation/cancel-confirmation.component';

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

  constructor(private bookingService: BookingService, private employeeService: EmployeeService, private deskService: DeskService, private departmentService: DepartmentService, private dialog: MatDialog, private router: Router) {

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

  returnDays(booking: Booking){
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    return this.calculateDaysBetween(startDate, endDate);
  }


  private calculateDaysBetween(startDate: Date, endDate: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const timeDifference = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDifference / millisecondsPerDay) + 1;
  }

  private openCancelDialog(booking: Booking): void {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

      if(endDate.getTime() - startDate.getTime() > 0){
        const dialogRef = this.dialog.open(CancelDialogComponent, {
          width: '600px',
          height: '350px',
          data: { booking }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result === 'confirm'){
            window.location.reload();
          }
      });
      } else {
        const dialogRef = this.dialog.open(CancelConfirmationComponent, {
          width: '600px',
          height: '350px',
          data: { booking }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result === 'confirm'){
            window.location.reload();
          }
      });
      }
      
  };
  
  cancelSelectedBooking(booking: Booking) {
    this.openCancelDialog(booking);
  }
  
  goToHome(){
    this.router.navigate(['/home']);
  }
}
