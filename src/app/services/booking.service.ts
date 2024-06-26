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
    return this.http.get<Booking[]>(`${this.baseUrl}/getAllBookingsByEmployeeEmail/${employeeEmail}`);
  }

  getActiveBookingsByEmployeeEmail(employeeEmail: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/getActiveBookingsByEmployeeEmail/${employeeEmail}`);
  }

  getBookingHistoryByEmployeeEmail(employeeEmail: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/getBookingHistoryByEmployeeEmail/${employeeEmail}`);
  }

  isDeskBooked(deskID: number, wantedstartDate: string, wantedendDate): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/isDeskBooked?deskID=${deskID}&wantedstartDate=${wantedstartDate}&wantedendDate=${wantedendDate}`);
  }

  getAllBookedDesksByDay( wantedstartDate: string, wantedendDate): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/getAllBookedDesksByDay?wantedstartDate=${wantedstartDate}&wantedendDate=${wantedendDate}`);
  }

  addBooking(bookingData: BookingData): Observable<string>{ 
    return this.http.post<string>(`${this.baseUrl}/addBooking`, bookingData, { responseType: 'text' as 'json' });
  }

  cancelBooking(id: number): Observable<string>{
    return this.http.delete<string>(`${this.baseUrl}/deleteBooking/${id}`, { responseType: 'text' as 'json' });
  }

}
