import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../models/Login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl: string = "https://localhost:7142/api/employee";
  constructor(private http: HttpClient) { }

  login (login: Login): Observable<any>{
    return this.http.post<any> (`${this.baseUrl}/login`, login);
  }

}
