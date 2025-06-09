import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { PaymentService } from '../services/payment.service';
import { BookingService } from '../services/booking.service';
import { ClassifiedService } from '../services/classified.service';
import { ComplaintService } from '../services/complaint.service';
import { AnnouncementService } from '../services/announcement.service';
import * as AppActions from './actions';

@Injectable()
export class AppEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadUsers),
      switchMap(() => this.authService.getUsers().pipe(
        map(users => AppActions.loadUsersSuccess({ users }))
      ))
    )
  );

  loadPayments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadPayments),
      switchMap(() => this.paymentService.getPayments().pipe(
        map(payments => AppActions.loadPaymentsSuccess({ payments }))
      ))
    )
  );

  addPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.addPayment),
      switchMap(({ payment }) => this.paymentService.addPayment(payment).pipe(
        map(() => AppActions.loadPayments())
      ))
    )
  );

  loadBookings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadBookings),
      switchMap(() => this.bookingService.getBookings().pipe(
        map(bookings => AppActions.loadBookingsSuccess({ bookings }))
      ))
    )
  );

  loadClassifieds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadClassifieds),
      switchMap(() => this.classifiedService.getClassifieds().pipe(
        map(classifieds => AppActions.loadClassifiedsSuccess({ classifieds }))
      ))
    )
  );

  loadComplaints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadComplaints),
      switchMap(() => this.complaintService.getComplaints().pipe(
        map(complaints => AppActions.loadComplaintsSuccess({ complaints }))
      ))
    )
  );

  loadAnnouncements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadAnnouncements),
      switchMap(() => this.announcementService.getAnnouncements().pipe(
        map(announcements => AppActions.loadAnnouncementsSuccess({ announcements }))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private classifiedService: ClassifiedService,
    private complaintService: ComplaintService,
    private announcementService: AnnouncementService
  ) {}
}
