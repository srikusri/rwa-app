import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Announcement } from '../../../core/models/announcement.model';
import * as AppActions from '../../../core/store/actions';
import { AppState } from '../../../core/store/reducers';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  announcements$: Observable<Announcement[]>;

  constructor(private store: Store<AppState>) {
    this.announcements$ = store.select(state => state.announcements);
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadAnnouncements());
  }
}
