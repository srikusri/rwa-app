import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint.model';

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/complaints`);
  }

  addComplaint(complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(`${this.apiUrl}/complaints`, complaint);
  }

  resolveComplaint(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/complaints/${id}`, { status: 'resolved' });
  }
}
