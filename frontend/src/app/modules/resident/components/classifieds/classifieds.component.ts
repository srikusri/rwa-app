import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Classified } from '../../../core/models/classified.model';
import * as AppActions from '../../../core/store/actions';
import { AppState } from '../../../core/store/reducers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-classifieds',
  templateUrl: './classifieds.component.html',
  styleUrls: ['./classifieds.component.scss']
})
export class ClassifiedsComponent implements OnInit {
  classifiedForm: FormGroup;
  classifieds$: Observable<Classified[]>;
  currentUserId = 'currentUserId';

  constructor(private store: Store<AppState>, private fb: FormBuilder) {
    this.classifieds$ = store.select(state => state.classifieds);
    this.classifiedForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadClassifieds());
  }

  submitClassified() {
    if (this.classifiedForm.valid) {
      const classified: Classified = {
        id: Math.random().toString(),
        userId: this.currentUserId,
        ...this.classifiedForm.value,
        status: 'pending'
      };
      this.store.dispatch(AppActions.addClassified({ classified }));
      this.classifiedForm.reset();
    }
  }

  retractClassified(id: string) {
    this.store.dispatch(AppActions.retractClassified({ id }));
  }
}
