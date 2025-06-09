export interface Payment {
  id: string;
  userId: string;
  type: 'maintenance' | 'amenities' | 'lift' | 'misc';
  amount: number;
  proof: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}
