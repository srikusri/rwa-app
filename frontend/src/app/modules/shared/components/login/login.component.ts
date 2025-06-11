import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user.model'; // Added User import

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  mobile = '';
  otp = '';
  otpSent = false;

  constructor(private authService: AuthService, private router: Router) {}

  generateOtp() {
    this.authService.generateOtp(this.mobile).subscribe(() => {
      this.otpSent = true;
    });
  }

  login() {
    this.authService.verifyOtp(this.mobile, this.otp).subscribe((valid: boolean) => {
      if (valid) {
        this.authService.onboardUser({ mobile: this.mobile, role: 'resident', name: 'User', apartmentId: 'apt1', isApproved: false })
          .subscribe((user: User) => {
            this.router.navigate([user.role === 'admin' ? '/admin' : '/resident']);
          });
      }
    });
  }
}
