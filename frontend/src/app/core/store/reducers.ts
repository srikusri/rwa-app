import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import { Payment } from '../models/payment.model';
import { Booking } from '../models/booking.model';
import { Classified } from '../models/classified.model';
import { Complaint } from '../models/complaint.model';
import { Announcement } from '../models/announcement.model';
import * as AppActions from './actions';

export interface AppState {
  users: User[];
  payments: Payment[];
  bookings: Booking[];
  classifieds: Classified[];
  complaints: Complaint[];
  announcements: Announcement[];
}

const initialState: AppState = {
  users: [],
  payments: [],
  bookings: [],
  classifieds: [],
  complaints: [],
  announcements: []
};

const appReducer = createReducer(
  initialState,
  on(AppActions.loadUsersSuccess, (state, { users }) => ({ ...state, users })),
  on(AppActions.approveUser, (state, { userId }) => ({
    ...state,
    users: state.users.map(u => u.id === userId ? { ...u, isApproved: true } : u)
  })),
  on(AppActions.loadPaymentsSuccess, (state, { payments }) => ({ ...state, payments })),
  on(AppActions.addPayment, (state, { payment }) => ({ ...state, payments: [...state.payments, payment] })),
  on(AppActions.approvePayment, (state, { paymentId }) => ({
    ...state,
    payments: state.payments.map(p => p.id === paymentId ? { ...p, status: 'approved' } : p)
  })),
  on(AppActions.rejectPayment, (state, { paymentId }) => ({
    ...state,
    payments: state.payments.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p)
  })),
  on(AppActions.loadBookingsSuccess, (state, { bookings }) => ({ ...state, bookings })),
  on(AppActions.addBooking, (state, { booking }) => ({ ...state, bookings: [...state.bookings, booking] })),
  on(AppActions.loadClassifiedsSuccess, (state, { classifieds }) => ({ ...state, classifieds })),
  on(AppActions.addClassified, (state, { classified }) => ({ ...state, classifieds: [...state.classifieds, classified] })),
  on(AppActions.approveClassified, (state, { id }) => ({
    ...state,
    classifieds: state.classifieds.map(c => c.id === id ? { ...c, status: 'approved' } : c)
  })),
  on(AppActions.rejectClassified, (state, { id }) => ({
    ...state,
    classifieds: state.classifieds.map(c => c.id === id ? { ...c, status: 'rejected' } : c)
  })),
  on(AppActions.retractClassified, (state, { id }) => ({
    ...state,
    classifieds: state.classifieds.filter(c => c.id !== id)
  })),
  on(AppActions.loadComplaintsSuccess, (state, { complaints }) => ({ ...state, complaints })),
  on(AppActions.addComplaint, (state, { complaint }) => ({ ...state, complaints: [...state.complaints, complaint] })),
  on(AppActions.resolveComplaint, (state, { id }) => ({
    ...state,
    complaints: state.complaints.map(c => c.id === id ? { ...c, status: 'resolved' } : c)
  })),
  on(AppActions.loadAnnouncementsSuccess, (state, { announcements }) => ({ ...state, announcements })),
  on(AppActions.addAnnouncement, (state, { announcement }) => ({ ...state, announcements: [...state.announcements, announcement] }))
);

export function reducer(state: AppState | undefined, action: any) {
  return appReducer(state, action);
}
