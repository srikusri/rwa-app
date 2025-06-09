import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Booking } from '../../../core/models/booking.model';
import * as AppActions from '../../../core/store/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-party-hall-booking',
  templateUrl: './party-hall-booking.component.html',
  styleUrls: ['./party-hall-booking.component.scss']
})
export class PartyHallBookingComponent implements OnInit {
  bookingForm: FormGroup;
  bookings$: Observable<Booking[]>;

  constructor(private store: Store<{ app: AppState }>, private fb: FormBuilder) {
    this.bookings$ = store.select(state => state.app.bookings);
    this.bookingForm = this.fb.group({
      date: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadBookings());
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.bookingForm.patchValue({ date: event.value });
  }

  submitBooking() {
    if (this.bookingForm.valid) {
      const booking: Booking = {
        id: Math.random().toString(),
        userId: 'currentUserId',
        date: this.bookingForm.value.date,
        status: 'pending'
      };
      this.store.dispatch(AppActions.addBooking({ booking }));
      this.bookingForm.reset();
    }
  }
}
