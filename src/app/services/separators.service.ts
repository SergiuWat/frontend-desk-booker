import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Separators } from '../models/Separators';

@Injectable({
  providedIn: 'root'
})
export class SeparatorsService {

  baseUrl: string = "https://localhost:7142/api/separators";
  constructor(private http: HttpClient) { }

  getSeparatorsByDepartmentId(id: number): Observable<Separators[]> {
    return this.http.get<Separators[]>(`${this.baseUrl}/getSeparatorsByDepartmentId/${id}`);
  }
}
