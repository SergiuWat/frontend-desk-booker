import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../models/Login';
import { Observable } from 'rxjs';
import { GenerateCode } from '../models/GenerateCode';
import { ChangePassword } from '../models/ChangePassword';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl: string = "https://localhost:7142/api/employee";
  codeUrl: string = "https://localhost:7142/api/resetPassword"
  constructor(private http: HttpClient) { }

  login (login: Login): Observable<any>{
    return this.http.post<any> (`${this.baseUrl}/login`, login);
  }

  generateCode (generateCode: GenerateCode): Observable<any>{
    return this.http.post<any> (`${this.codeUrl}/generateCode`, generateCode);
  }

  verifyCode (changePassword: ChangePassword): Observable<any>{
    return this.http.post<any> (`${this.codeUrl}/verifyCode`, changePassword);
  }

}
