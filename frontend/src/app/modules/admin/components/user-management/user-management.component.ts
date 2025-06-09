import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../../core/models/user.model'; // Corrected path
import { AuthService } from '../../../../core/services/auth.service'; // Corrected path
import * as AppActions from '../../../../core/store/actions'; // Corrected path
import { AppState } from '../../../../core/store/app.state'; // Added AppState import

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  users$: Observable<User[]>;
  currentUser: User | null = null;

  constructor(private store: Store<{ app: AppState }>, private authService: AuthService) {
    this.users$ = store.select(state => state.app.users);
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadUsers());
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  approveUser(userId: string) {
    this.store.dispatch(AppActions.approveUser({ userId }));
  }

  // handleChangeRole method removed

  canManageRole(targetUser: User): boolean {
    if (!this.currentUser || this.currentUser.role !== 'tenantAdmin') {
      return false;
    }
    return targetUser.tenantId === this.currentUser.tenantId && targetUser.role !== 'superAdmin';
  }

  promoteToTenantAdmin(userId: string) {
    // Backend ensures this is only possible if current user is tenantAdmin and target is in their tenant
    this.authService.updateUserRole(userId, 'tenantAdmin').subscribe(() => {
      this.store.dispatch(AppActions.loadUsers()); // Refresh list
    });
  }

  demoteToResident(userId: string) {
    // Backend ensures this is only possible if current user is tenantAdmin and target is in their tenant
    this.authService.updateUserRole(userId, 'resident').subscribe(() => {
      this.store.dispatch(AppActions.loadUsers()); // Refresh list
    });
  }

  cycleRoleForSuperAdmin(targetUser: User) {
    if (!this.currentUser || this.currentUser.role !== 'superAdmin') return;

    let newRole = '';
    if (targetUser.role === 'resident') newRole = 'tenantAdmin';
    else if (targetUser.role === 'tenantAdmin') newRole = 'superAdmin';
    else if (targetUser.role === 'superAdmin') newRole = 'resident'; // Demote
    else newRole = 'resident'; // Default for safety

    if (newRole) {
      this.authService.updateUserRole(targetUser.id, newRole).subscribe(() => {
        this.store.dispatch(AppActions.loadUsers()); // Refresh list
      });
    }
  }
}
