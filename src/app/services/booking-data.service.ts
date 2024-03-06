import { Injectable } from '@angular/core';
import { BookingData } from '../models/BookingData';

@Injectable({
  providedIn: 'root'
})
export class BookingDataService {

  bookingData: BookingData = new BookingData();

  constructor() { }
}
