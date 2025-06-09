import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Payment } from '../../../core/models/payment.model';
import * as AppActions from '../../../core/store/actions';
import { PaymentService } from '../../../core/services/payment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payment-submission',
  templateUrl: './payment-submission.component.html',
  styleUrls: ['./payment-submission.component.scss']
})
export class PaymentSubmissionComponent {
  paymentForm: FormGroup;
  file: File | null = null;
  uploading = false;

  constructor(
    private store: Store<{ app: AppState }>,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      type: ['maintenance', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  async submitPayment() {
    if (this.paymentForm.valid && this.file) {
      this.uploading = true;
      try {
        const proofUrl = await this.paymentService.uploadProof(this.file, 'currentUserId');
        const payment: Payment = {
          id: Math.random().toString(),
          userId: 'currentUserId',
          type: this.paymentForm.value.type,
          amount: this.paymentForm.value.amount,
          proof: proofUrl,
          status: 'pending',
          createdAt: new Date()
        };
        this.store.dispatch(AppActions.addPayment({ payment }));
        this.snackBar.open('Payment submitted successfully!', 'Close', { duration: 3000 });
        this.paymentForm.reset();
        this.file = null;
        this.paymentForm.patchValue({ type: 'maintenance', amount: 0 });
      } catch (error) {
        this.snackBar.open('Failed to submit payment. Please try again.', 'Close', { duration: 3000 });
      } finally {
        this.uploading = false;
      }
    }
  }
}
