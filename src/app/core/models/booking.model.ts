export interface Booking {
  id: string;
  userId: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
}
