import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as AppActions from '../../../core/store/actions';
import { Announcement } from '../../../core/models/announcement.model';

@Component({
  selector: 'app-announcement-management',
  templateUrl: './announcement-management.component.html',
  styleUrls: ['./announcement-management.component.scss']
})
export class AnnouncementManagementComponent {
  announcementForm: FormGroup;

  constructor(private store: Store<{ app: AppState }>, private fb: FormBuilder) {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  submitAnnouncement() {
    if (this.announcementForm.valid) {
      const announcement: Announcement = {
        id: Math.random().toString(),
        ...this.announcementForm.value,
        createdAt: new Date()
      };
      this.store.dispatch(AppActions.addAnnouncement({ announcement }));
      this.announcementForm.reset();
    }
  }
}
