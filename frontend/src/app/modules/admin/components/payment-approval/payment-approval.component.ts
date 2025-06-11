import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Payment } from '../../../core/models/payment.model';
import * as AppActions from '../../../core/store/actions';
import { AppState } from '../../../core/store/reducers';

@Component({
  selector: 'app-payment-approval',
  templateUrl: './payment-approval.component.html'
})
export class PaymentApprovalComponent implements OnInit {
  payments$: Observable<Payment[]>;
  totalApproved$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.payments$ = store.select(state => state.payments);
    this.totalApproved$ = store.select(state =>
      state.payments
        .filter((p: Payment) => p.status === 'approved')
        .reduce((sum: number, p: Payment) => sum + p.amount, 0)
    );
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadPayments());
  }

  approvePayment(id: string) {
    this.store.dispatch(AppActions.approvePayment({ paymentId: id }));
  }

  rejectPayment(id: string) {
    this.store.dispatch(AppActions.rejectPayment({ paymentId: id }));
  }
}
