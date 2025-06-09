import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import * as AppActions from '../../../core/store/actions';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  users$: Observable<User[]>;
  constructor(private store: Store<{ app: AppState }>, private authService: AuthService) {
    this.users$ = store.select(state => state.app.users);
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadUsers());
  }

  approveUser(userId: string) {
    this.store.dispatch(AppActions.approveUser({ userId }));
  }

  assignAdmin(userId: string) {
    this.authService.assignAdmin(userId, 'apt1').subscribe();
  }
}
