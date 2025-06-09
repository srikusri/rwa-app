import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';
import { Payment } from '../models/payment.model';
import { Booking } from '../models/booking.model';
import { Classified } from '../models/classified.model';
import { Complaint } from '../models/complaint.model';
import { Announcement } from '../models/announcement.model';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ users: User[] }>());
export const approveUser = createAction('[Users] Approve User', props<{ userId: string }>());

export const loadPayments = createAction('[Payments] Load Payments');
export const loadPaymentsSuccess = createAction('[Payments] Load Payments Success', props<{ payments: Payment[] }>());
export const addPayment = createAction('[Payments] Add Payment', props<{ payment: Payment }>());
export const approvePayment = createAction('[Payments] Approve Payment', props<{ paymentId: string }>());
export const rejectPayment = createAction('[Payments] Reject Payment', props<{ paymentId: string }>());

export const loadBookings = createAction('[Bookings] Load Bookings');
export const loadBookingsSuccess = createAction('[Bookings] Load Bookings Success', props<{ bookings: Booking[] }>());
export const addBooking = createAction('[Bookings] Add Booking', props<{ booking: Booking }>());

export const loadClassifieds = createAction('[Classifieds] Load Classifieds');
export const loadClassifiedsSuccess = createAction('[Classifieds] Load Classifieds Success', props<{ classifieds: Classified[] }>());
export const addClassified = createAction('[Classifieds] Add Classified', props<{ classified: Classified }>());
export const approveClassified = createAction('[Classifieds] Approve Classified', props<{ id: string }>());
export const rejectClassified = createAction('[Classifieds] Reject Classified', props<{ id: string }>());
export const retractClassified = createAction('[Classifieds] Retract Classified', props<{ id: string }>());

export const loadComplaints = createAction('[Complaints] Load Complaints');
export const loadComplaintsSuccess = createAction('[Complaints] Load Complaints Success', props<{ complaints: Complaint[] }>());
export const addComplaint = createAction('[Complaints] Add Complaint', props<{ complaint: Complaint }>());
export const resolveComplaint = createAction('[Complaints] Resolve Complaint', props<{ id: string }>());

export const loadAnnouncements = createAction('[Announcements] Load Announcements');
export const loadAnnouncementsSuccess = createAction('[Announcements] Load Announcements Success', props<{ announcements: Announcement[] }>());
export const addAnnouncement = createAction('[Announcements] Add Announcement', props<{ announcement: Announcement }>());
