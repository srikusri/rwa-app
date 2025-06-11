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

  // assignAdmin method removed

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUserRole(userId: string, newRole: string): Observable<User> {
    // tenantId is implicitly handled by the backend based on the currently authenticated user (if tenantAdmin)
    // or not needed if making someone a superAdmin (if logged in as superAdmin)
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, { role: newRole });
  }

  getCurrentUser(): Observable<User> {
    // Mock; replace with real auth logic
    // Default to tenantAdmin for this step
    return of({ id: 'tenantAdminUser', mobile: '1122334455', role: 'tenantAdmin', name: 'Current Tenant Admin', tenantId: 'default-tenant', apartmentId: 'default-apartment', isApproved: true });
    // For testing as superAdmin, uncomment below and comment out tenantAdmin:
    // return of({ id: 'superAdminUser', mobile: '1234567890', role: 'superAdmin', name: 'Current Super Admin', tenantId: null, isApproved: true });
  }
}
