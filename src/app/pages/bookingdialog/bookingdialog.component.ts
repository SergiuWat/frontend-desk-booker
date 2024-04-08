import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingData } from 'src/app/models/BookingData';

@Component({
  selector: 'app-bookingdialog',
  templateUrl: './bookingdialog.component.html',
  styleUrls: ['./bookingdialog.component.css']
})
export class BookingdialogComponent {
  bookingData: BookingData;
  constructor(
    public dialogRef: MatDialogRef<BookingdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { deskId: number, bookingData: BookingData }
  ) {
    this.bookingData = data.bookingData;
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
