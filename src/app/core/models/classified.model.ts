export interface Classified {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}
