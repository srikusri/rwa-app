import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TenantState } from '../reducers/tenant.reducer'; // Assuming tenantReducer is in the same directory or path is adjusted

// Feature selector for the tenant state
// Make sure 'tenantsFeature' matches the key used when registering the reducer in the main app state
export const selectTenantFeatureState = createFeatureSelector<TenantState>('tenants'); // Or a more specific feature name like 'tenantManagement'

// Selector for the list of tenants
export const selectAllTenants = createSelector(
  selectTenantFeatureState,
  (state: TenantState) => state.tenants
);

// Selector for the loading status
export const selectTenantsLoading = createSelector(
  selectTenantFeatureState,
  (state: TenantState) => state.loading
);

// Selector for any error
export const selectTenantsError = createSelector(
  selectTenantFeatureState,
  (state: TenantState) => state.error
);

// Example for selecting a specific tenant if selectedTenantId was in state
// export const selectCurrentTenant = createSelector(
//   selectTenantFeatureState,
//   (state: TenantState) => state.selectedTenantId ? state.tenants.find(t => t.id === state.selectedTenantId) : null
// );

// Add more selectors as needed, e.g., for specific tenant by ID from the list
export const selectTenantById = (tenantId: string) => createSelector(
    selectAllTenants,
    (tenants) => tenants.find(t => t.id === tenantId)
);
