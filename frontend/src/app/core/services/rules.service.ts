import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RulesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getRules(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/rules`);
  }
}
