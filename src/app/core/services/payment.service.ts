import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  async uploadProof(file: File, userId: string): Promise<string> {
    return Promise.resolve(`https://mock-storage.com/proofs/${userId}/${file.name}`);
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments`);
  }

  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/payments`, payment);
  }

  addPaymentWithFile(formData: FormData): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/payments`, formData);
  }

  approvePayment(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/payments/${id}`, { status: 'approved' });
  }

  rejectPayment(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/payments/${id}`, { status: 'rejected' });
  }
}
