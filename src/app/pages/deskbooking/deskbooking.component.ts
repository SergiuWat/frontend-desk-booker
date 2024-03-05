import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingDataService } from 'src/app/services/booking-data.service';

@Component({
  selector: 'app-deskbooking',
  templateUrl: './deskbooking.component.html',
  styleUrls: ['./deskbooking.component.css']
})
export class DeskbookingComponent {

  selectedDate: Date;

  constructor(private datePipe: DatePipe, private sharedBookingData: BookingDataService, private snackBar: MatSnackBar){
    
  }

  handleSelectedDate() {

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (this.selectedDate >= currentDate) {
      this.sharedBookingData.bookingData.bookedDay = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      console.log(this.sharedBookingData.bookingData)
    } else {
      this.snackBar.open('Please select a valid date', 'Close', {duration:3000})
    }

    
  }

}
