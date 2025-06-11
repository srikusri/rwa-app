import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Complaint } from '../../../core/models/complaint.model';
import * as AppActions from '../../../core/store/actions';
import { AppState } from '../../../core/store/reducers';

@Component({
  selector: 'app-complaint-management',
  templateUrl: './complaint-management.component.html'
})
export class ComplaintManagementComponent implements OnInit {
  complaints$: Observable<Complaint[]>;

  constructor(private store: Store<AppState>) {
    this.complaints$ = store.select(state => state.complaints);
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadComplaints());
  }

  resolveComplaint(id: string) {
    this.store.dispatch(AppActions.resolveComplaint({ id }));
  }
}
