import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/Department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  baseUrl: string = "https://localhost:7142/api/department";
  constructor(private http: HttpClient) { }

  getFloorsByDepartmentName(name: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/getFloorsByDepartmentName?name=${name}`);
  }
}
