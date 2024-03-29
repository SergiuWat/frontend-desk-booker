import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Booking } from '../models/Booking';
import { Observable } from 'rxjs';
import { BookingDataService } from './booking-data.service';
import { BookingData } from '../models/BookingData';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  baseUrl: string = "https://localhost:7142/api/booking";
  constructor(private http: HttpClient) { }

  getAllBookingsByEmployeeEmail(employeeEmail: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/getBookingByEmployeeEmail/${employeeEmail}`);
  }

  isDeskBooked(deskID: number, wantedDate: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/isDeskBooked?deskID=${deskID}&wantedDate=${wantedDate}`);
  }

  getAllBookedDesksByDay(wantedDate: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/getAllBookedDesksByDay?wantedDate=${wantedDate}`);
  }

  addBooking(bookingData: BookingData): Observable<any>{ 
    console.log(bookingData);  
    return this.http.post<any>(`${this.baseUrl}/addBooking`, bookingData);
  }

}
