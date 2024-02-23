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

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(this.baseUrl + '/getDepartmentById/' + id.toString());
  }

  getFloorsByDepartmentName(name: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/getFloorsByDepartmentName?name=${name}`);
  }

  getDepartmentsByFloorID(floorID: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/getAllDepartmentsByFloorId/${floorID}`);
  }
}
