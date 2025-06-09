import { createReducer, on } from '@ngrx/store';
import { Tenant } from '../../models/tenant.model';
import * as TenantActions from '../actions/tenant.actions';

export interface TenantState {
  tenants: Tenant[];
  loading: boolean;
  error: any;
  // selectedTenantId: string | null; // If supporting a detail view later
}

export const initialTenantState: TenantState = {
  tenants: [],
  loading: false,
  error: null,
  // selectedTenantId: null,
};

export const tenantReducer = createReducer(
  initialTenantState,

  // Load Tenants
  on(TenantActions.loadTenants, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TenantActions.loadTenantsSuccess, (state, { tenants }) => ({
    ...state,
    tenants,
    loading: false,
  })),
  on(TenantActions.loadTenantsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Tenant
  on(TenantActions.createTenant, (state) => ({ // No change to tenant list until success
    ...state,
    loading: true, // Or a specific creating flag e.g. creating: true
    error: null,
  })),
  on(TenantActions.createTenantSuccess, (state, { tenant }) => ({
    ...state,
    tenants: [...state.tenants, tenant],
    loading: false, // Or creating: false
  })),
  on(TenantActions.createTenantFailure, (state, { error }) => ({
    ...state,
    loading: false, // Or creating: false
    error,
  })),

  // Update Tenant
  on(TenantActions.updateTenant, (state) => ({ // No change to tenant list until success
    ...state,
    loading: true, // Or a specific updating flag e.g. updating: true
    error: null,
  })),
  on(TenantActions.updateTenantSuccess, (state, { tenant: updatedTenant }) => ({
    ...state,
    tenants: state.tenants.map((tenant) =>
      tenant.id === updatedTenant.id ? updatedTenant : tenant
    ),
    loading: false, // Or updating: false
  })),
  on(TenantActions.updateTenantFailure, (state, { error }) => ({
    ...state,
    loading: false, // Or updating: false
    error,
  }))

  // Handle selectTenant if added later
  // on(TenantActions.selectTenant, (state, { tenantId }) => ({
  //   ...state,
  //   selectedTenantId: tenantId
  // }))
);
