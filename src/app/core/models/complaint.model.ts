export interface Complaint {
  id: string;
  userId: string;
  description: string;
  status: 'open' | 'resolved';
  createdAt: Date;
}
