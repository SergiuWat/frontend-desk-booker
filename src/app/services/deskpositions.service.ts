import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeskPositions } from '../models/DeskPositions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeskpositionsService {

  baseUrl: string = "https://localhost:7142/api/deskPositions";
  constructor(private http: HttpClient) { }

  getAllDeskPositions(): Observable<DeskPositions[]> {
    return this.http.get<DeskPositions[]>(`${this.baseUrl}/getAllDesksPositions`);
  }
  getAllDeskPositionsByDepartment(id: number): Observable<DeskPositions[]> {
    return this.http.get<DeskPositions[]>(`${this.baseUrl}/getAllDesksPositionsByDepartment/${id}`);
  }
}
