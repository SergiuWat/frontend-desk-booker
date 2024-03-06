import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Waitinglist } from '../models/WaitingList';

@Injectable({
  providedIn: 'root'
})
export class WaitingListService {

  baseUrl: string = "https://localhost:7142/api/waitinglist";
  constructor(private http: HttpClient) { }

  getWaitingListForCurrentEmployee(): Observable<Waitinglist[]>{
    const token = localStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<Waitinglist[]>(`${this.baseUrl}/getWaitingListByToken`, {headers});
  }

}
