import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Classified } from '../../../core/models/classified.model';
import * as AppActions from '../../../core/store/actions';
import { AppState } from '../../../core/store/reducers';

@Component({
  selector: 'app-classified-approval',
  templateUrl: './classified-approval.component.html'
})
export class ClassifiedApprovalComponent implements OnInit {
  classifieds$: Observable<Classified[]>;

  constructor(private store: Store<AppState>) {
    this.classifieds$ = store.select(state => state.classifieds);
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadClassifieds());
  }

  approveClassified(id: string) {
    this.store.dispatch(AppActions.approveClassified({ id }));
  }

  rejectClassified(id: string) {
    this.store.dispatch(AppActions.rejectClassified({ id }));
  }
}
