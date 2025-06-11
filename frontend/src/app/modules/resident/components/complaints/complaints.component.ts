import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Complaint } from '../../../core/models/complaint.model';
import * as AppActions from '../../../core/store/actions';
import { AppState } from '../../../core/store/reducers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  complaintForm: FormGroup;
  complaints$: Observable<Complaint[]>;

  constructor(private store: Store<AppState>, private fb: FormBuilder) {
    this.complaints$ = store.select(state => state.complaints);
    this.complaintForm = this.fb.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadComplaints());
  }

  submitComplaint() {
    if (this.complaintForm.valid) {
      const complaint: Complaint = {
        id: Math.random().toString(),
        userId: 'currentUserId',
        description: this.complaintForm.value.description,
        status: 'open',
        createdAt: new Date()
      };
      this.store.dispatch(AppActions.addComplaint({ complaint }));
      this.complaintForm.reset();
    }
  }
}
