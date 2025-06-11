export interface User {
  id: string;
  mobile: string;
  role: 'admin' | 'resident' | 'superAdmin' | 'tenantAdmin';
  name: string;
  apartmentId: string;
  isApproved: boolean;
  tenantId: string | null;
}
