import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/Employee';
import { EmployeeUpdatePictureModel } from '../models/EmployeeUpdatePictureModel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl: string = "https://localhost:7142/api/employee";
  constructor(private http: HttpClient) { }

  getEmployeeInfo(): Observable<Employee>{
    const token = localStorage.getItem('ACCESS_TOKEN');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<Employee>(`${this.baseUrl}/getEmployeeByEmail`, {headers});
  }

  updateEmployee(employee: EmployeeUpdatePictureModel): Observable<any>{
    // const token = localStorage.getItem('ACCESS_TOKEN');
    // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.put<Employee>(`${this.baseUrl}/updateEmployeePicture`, employee);
  } 
}
