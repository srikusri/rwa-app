export interface User {
  id: string;
  mobile: string;
  role: 'admin' | 'resident';
  name: string;
  apartmentId: string;
  isApproved: boolean;
}
