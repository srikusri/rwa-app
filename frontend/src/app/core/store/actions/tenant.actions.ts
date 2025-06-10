import { createAction, props } from '@ngrx/store';
import { Tenant } from '../../models/tenant.model';
import { User } from '../../models/user.model'; // For tenant admin assignment

// Load Tenants
export const loadTenants = createAction('[Tenant API] Load Tenants');
export const loadTenantsSuccess = createAction(
  '[Tenant API] Load Tenants Success',
  props<{ tenants: Tenant[] }>()
);
export const loadTenantsFailure = createAction(
  '[Tenant API] Load Tenants Failure',
  props<{ error: any }>()
);

// Create Tenant
export const createTenant = createAction(
  '[Tenant Admin Page] Create Tenant',
  // initialAdminUserId is the ID of an *existing* user to be made tenant admin
  props<{ tenant: Pick<Tenant, 'name' | 'description'>, initialAdminUserId: string }>()
);
export const createTenantSuccess = createAction(
  '[Tenant API] Create Tenant Success',
  props<{ tenant: Tenant }>()
);
export const createTenantFailure = createAction(
  '[Tenant API] Create Tenant Failure',
  props<{ error: any }>()
);

// Update Tenant (includes status changes and admin assignment)
export const updateTenant = createAction(
  '[Tenant Admin Page] Update Tenant',
  // tenant payload includes id and fields to update (name, description, status)
  // initialAdminUserId is optional, for changing the admin
  props<{ tenant: Partial<Tenant> & { id: string }, initialAdminUserId?: string }>()
);
export const updateTenantSuccess = createAction(
  '[Tenant API] Update Tenant Success',
  props<{ tenant: Tenant }>() // Or Update<Tenant> from ngrx/entity if using it
);
export const updateTenantFailure = createAction(
  '[Tenant API] Update Tenant Failure',
  props<{ error: any }>()
);

// Maybe actions for selecting a tenant if needed for a detail view later
// export const selectTenant = createAction(
//   '[Tenant List Page] Select Tenant',
//   props<{ tenantId: string }>()
// );
