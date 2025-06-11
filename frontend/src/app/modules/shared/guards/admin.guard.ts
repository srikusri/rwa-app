import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../core/models/user.model'; // Import User model

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

import { User } from '../../core/models/user.model'; // Import User model

// ... (other imports)

// @Injectable decorator and class definition ...

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map((user: User | null) => { // Explicitly type user as User | null
        if (user?.role !== 'admin') {
          this.router.navigate(['/resident']);
          return false;
        }
        return true;
      })
    );
  }
}
