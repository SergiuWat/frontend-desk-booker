import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Booking } from 'src/app/models/Booking';
import { BookingData } from 'src/app/models/BookingData';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.css']
})
export class CancelDialogComponent implements AfterViewInit {
  @ViewChild('selectContainer', { static: false }) selectContainer: ElementRef;
  bookingToCancel: Booking;
  selectedDates: Set<string> = new Set();

  constructor(private bookingService: BookingService,
    public dialogRef: MatDialogRef<CancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { booking: Booking }
  ) {
    this.bookingToCancel = data.booking;
  }

  ngAfterViewInit(): void {
    const bookingStartDate = new Date(this.bookingToCancel.startDate);
    bookingStartDate.setHours(0, 0, 0, 0);
    const bookingEndDate = new Date(this.bookingToCancel.endDate);
    bookingEndDate.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;
    const numberOfDays = Math.round(Math.abs((bookingEndDate.getTime() - bookingStartDate.getTime()) / oneDay));

    const listContainer = document.createElement('div');
    listContainer.style.marginBottom = '0px';

    for (let i = 0; i <= numberOfDays; i++) {
      const currentDate = new Date(bookingStartDate);
      currentDate.setDate(bookingStartDate.getDate() + i);

      const listItem = document.createElement('div');
      listItem.style.display = 'flex';
      listItem.style.alignItems = 'center';
      listItem.style.marginBottom = '5px';

      const dateLabel = document.createElement('span');
      dateLabel.textContent = currentDate.toDateString();
      dateLabel.style.flex = '1';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      checkbox.value = nextDay.toISOString();
      checkbox.style.marginRight = '10px';
      checkbox.addEventListener('change', (event) => this.onDateToggle(event));

      listItem.appendChild(checkbox);
      listItem.appendChild(dateLabel);

      listContainer.appendChild(listItem);
    }

    if (this.selectContainer) {
      this.selectContainer.nativeElement.appendChild(listContainer);
      this.selectAll();
    } else {
      console.error('selectContainer element not found');
    }
  }

  onDateToggle(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedDates.add(checkbox.value);
    } else {
      this.selectedDates.delete(checkbox.value);
    }
  }

  onConfirm(): void {

    const bookingStartDate = new Date(this.bookingToCancel.startDate);
    let bookingEndDate = new Date(this.bookingToCancel.endDate);
    let foundSelected = false;

    const newPeriods = [];

    let currentPeriodStart = new Date(bookingStartDate);

    for (let currentDate = new Date(bookingStartDate); currentDate <= bookingEndDate; currentDate.setDate(currentDate.getUTCDate() + 1)) {
      const currentDateUTC = new Date(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate()
      );

      if (Array.from(this.selectedDates).find(day => new Date(day).getUTCDate() === currentDate.getUTCDate())) {
        if ((currentPeriodStart.getUTCDate() < currentDate.getUTCDate())) {
          const periodEndDate = new Date(currentDateUTC);
          periodEndDate.setUTCHours(0, 0, 0, 0);
          newPeriods.push({
            startDate: new Date(currentPeriodStart),
            endDate: periodEndDate
          });
        }
        foundSelected = true;
        currentPeriodStart = new Date(currentDate);
        currentPeriodStart.setDate(currentPeriodStart.getUTCDate() + 1);
      } else {
        if ((currentDateUTC.getUTCDate() === (bookingEndDate.getUTCDate() - 1)) && !foundSelected) {
          console.log(currentDateUTC.getUTCDate(), bookingEndDate.getUTCDate())
          bookingEndDate.setDate(bookingEndDate.getUTCDate() - 1);

        }
      }
    }

    if (currentPeriodStart <= bookingEndDate) {
      newPeriods.push({
        startDate: new Date(currentPeriodStart),
        endDate: new Date(bookingEndDate)
      });
    }

    console.log('New periods:', newPeriods);

    

    this.bookingService.cancelBooking(this.bookingToCancel.id).subscribe((response: string) => {
    
      newPeriods.forEach(period => {
        const newBooking: BookingData = {
              employeeId: this.bookingToCancel.employeeId,
              startDate: period.startDate.toISOString().split('T')[0],
              endDate: period.endDate.toISOString().split('T')[0],
              deskId: this.bookingToCancel.deskId
            };

            this.bookingService.addBooking(newBooking).subscribe((response: string) => {
            });
      });
      
      
    })
    this.dialogRef.close('confirm');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  selectAll(): void {
    this.selectedDates.clear();
    const checkboxes = this.selectContainer.nativeElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = true;
      this.selectedDates.add(checkbox.value);
    });
  }
}
