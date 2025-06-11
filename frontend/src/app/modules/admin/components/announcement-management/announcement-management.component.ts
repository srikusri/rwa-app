import { Component, OnInit } from '@angular/core'; // Added OnInit
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as AppActions from '../../../../core/store/actions'; // Corrected path
import { Announcement } from '../../../../core/models/announcement.model'; // Corrected path
import { User } from '../../../../core/models/user.model'; // Added User import
import { AuthService } from '../../../../core/services/auth.service'; // Added AuthService import
import { AppState } from '../../../../core/store/app.state'; // Added AppState import

@Component({
  selector: 'app-announcement-management',
  templateUrl: './announcement-management.component.html',
  styleUrls: ['./announcement-management.component.scss']
})
export class AnnouncementManagementComponent implements OnInit { // Implemented OnInit
  announcementForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private store: Store<{ app: AppState }>,
    private fb: FormBuilder,
    private authService: AuthService // Injected AuthService
  ) {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() { // Added ngOnInit
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if ((user.role as any) === 'superAdmin') {
        this.announcementForm.disable(); // Disable form for superAdmin
      }
    });
  }

  submitAnnouncement() {
    if (this.announcementForm.valid) {
      const announcement: Announcement = {
        id: Math.random().toString(), // ID generation will be handled by backend
        ...this.announcementForm.value,
        // tenantId will be handled by backend for tenantAdmin
        // For superAdmin, this form is disabled, preventing submission.
        // createdAt will be handled by backend
      };
      // The dispatched action might need adjustment if the backend auto-assigns ID and createdAt
      this.store.dispatch(AppActions.addAnnouncement({ announcement }));
      this.announcementForm.reset();
    }
  }
}
