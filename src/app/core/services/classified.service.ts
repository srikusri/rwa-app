import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classified } from '../models/classified.model';

@Injectable({ providedIn: 'root' })
export class ClassifiedService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getClassifieds(): Observable<Classified[]> {
    return this.http.get<Classified[]>(`${this.apiUrl}/classifieds`);
  }

  addClassified(classified: Classified): Observable<Classified> {
    return this.http.post<Classified>(`${this.apiUrl}/classifieds`, classified);
  }

  retractClassified(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/classifieds/${id}`);
  }
}
