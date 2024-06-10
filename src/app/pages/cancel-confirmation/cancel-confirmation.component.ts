import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Booking } from 'src/app/models/Booking';
import { BookingService } from 'src/app/services/booking.service';
import { CancelDialogComponent } from '../cancel-dialog/cancel-dialog.component';

@Component({
  selector: 'app-cancel-confirmation',
  templateUrl: './cancel-confirmation.component.html',
  styleUrls: ['./cancel-confirmation.component.css']
})
export class CancelConfirmationComponent {
  bookingToCancel: Booking;

  constructor(private bookingService: BookingService,
    public dialogRef: MatDialogRef<CancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { booking: Booking }
  ) {
    this.bookingToCancel = data.booking;
  }
  
  onConfirm() {
    this.bookingService.cancelBooking(this.bookingToCancel.id).subscribe((response: string) => {
      this.dialogRef.close('confirm');
    });
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
