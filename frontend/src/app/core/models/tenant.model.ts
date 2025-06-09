export interface Tenant {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  // Add any other fields that might come from the backend for a tenant
  // For example, if the backend API for GET /tenants/:id returns the admin user details:
  // initialAdminUserId?: string; // Or even the full User object if populated
}
