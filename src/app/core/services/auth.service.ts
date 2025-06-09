import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Updated to local backend

  constructor(private http: HttpClient) {}

  generateOtp(mobile: string): Observable<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`otp_${mobile}`, otp);
    return of(otp);
  }

  verifyOtp(mobile: string, otp: string): Observable<boolean> {
    const storedOtp = localStorage.getItem(`otp_${mobile}`);
    return of(storedOtp === otp);
  }

  onboardUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  assignAdmin(userId: string, apartmentId: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, { role: 'admin', apartmentId });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getCurrentUser(): Observable<User> {
    // Mock; replace with real auth logic
    return of({ id: 'currentUserId', mobile: '1234567890', role: 'resident', name: 'User', apartmentId: 'apt1', isApproved: true });
  }
}
