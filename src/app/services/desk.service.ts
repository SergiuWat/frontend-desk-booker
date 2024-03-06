import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Desk } from '../models/Desk';

@Injectable({
  providedIn: 'root'
})
export class DeskService {

  baseUrl: string = "https://localhost:7142/api/desk";
  constructor(private http: HttpClient) { }

  getDeskById(deskID: string): Observable<Desk> {
    return this.http.get<Desk>(`${this.baseUrl}/getDeskById/${deskID}`);
  }

  getAllDesksByDepartmentId(departmentId: number): Observable<Desk[]>{
    return this.http.get<Desk[]>(`${this.baseUrl}/getAllDesksByDepartmentId/${departmentId}`);
    
  }
}
