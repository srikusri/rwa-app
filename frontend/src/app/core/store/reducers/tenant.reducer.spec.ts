import { tenantReducer, initialTenantState, TenantState } from './tenant.reducer';
import * as TenantActions from '../actions/tenant.actions';
import { Tenant } from '../../models/tenant.model';

describe('Tenant Reducer', () => {
  const mockTenant1: Tenant = { id: 't1', name: 'Tenant 1', description: 'Desc 1', status: 'active' };
  const mockTenant2: Tenant = { id: 't2', name: 'Tenant 2', description: 'Desc 2', status: 'inactive' };
  const mockTenants: Tenant[] = [mockTenant1, mockTenant2];

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      const state = tenantReducer(initialTenantState, action);
      expect(state).toBe(initialTenantState);
    });
  });

  // Load Tenants
  describe('loadTenants action', () => {
    it('should set loading to true and clear error', () => {
      const action = TenantActions.loadTenants();
      const state = tenantReducer(initialTenantState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.tenants).toEqual([]); // Should not change tenants yet
    });
  });

  describe('loadTenantsSuccess action', () => {
    it('should populate tenants, set loading to false', () => {
      const action = TenantActions.loadTenantsSuccess({ tenants: mockTenants });
      // Start from a state where loading was true
      const previousState: TenantState = { ...initialTenantState, loading: true };
      const state = tenantReducer(previousState, action);

      expect(state.loading).toBe(false);
      expect(state.tenants).toEqual(mockTenants);
      expect(state.tenants.length).toBe(2);
    });
  });

  describe('loadTenantsFailure action', () => {
    it('should set error, set loading to false', () => {
      const error = { message: 'Failed to load tenants' };
      const action = TenantActions.loadTenantsFailure({ error });
      const previousState: TenantState = { ...initialTenantState, loading: true };
      const state = tenantReducer(previousState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  // Create Tenant
  describe('createTenant action', () => {
    it('should set loading to true and clear error', () => {
      const newTenantData = { name: 'New Tenant', description: 'New Desc' };
      const action = TenantActions.createTenant({ tenant: newTenantData, initialAdminUserId: 'adminId' });
      const state = tenantReducer(initialTenantState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('createTenantSuccess action', () => {
    it('should add the new tenant to the list and set loading to false', () => {
      const newTenant: Tenant = { id: 't3', name: 'Tenant 3', description: 'Desc 3', status: 'active' };
      const action = TenantActions.createTenantSuccess({ tenant: newTenant });
      const previousState: TenantState = { ...initialTenantState, tenants: [mockTenant1], loading: true };
      const state = tenantReducer(previousState, action);

      expect(state.loading).toBe(false);
      expect(state.tenants).toEqual([mockTenant1, newTenant]);
      expect(state.tenants.length).toBe(2);
    });
  });

  describe('createTenantFailure action', () => {
    it('should set error and set loading to false', () => {
      const error = { message: 'Failed to create tenant' };
      const action = TenantActions.createTenantFailure({ error });
      const previousState: TenantState = { ...initialTenantState, loading: true };
      const state = tenantReducer(previousState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  // Update Tenant
  describe('updateTenant action', () => {
    it('should set loading to true and clear error', () => {
      const updates: Partial<Tenant> & { id: string } = { id: 't1', name: 'Updated Tenant 1' };
      const action = TenantActions.updateTenant({ tenant: updates });
      const state = tenantReducer({ ...initialTenantState, tenants: mockTenants }, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('updateTenantSuccess action', () => {
    it('should update the tenant in the list and set loading to false', () => {
      const updatedTenant: Tenant = { ...mockTenant1, name: 'Tenant 1 Updated' };
      const action = TenantActions.updateTenantSuccess({ tenant: updatedTenant });
      const previousState: TenantState = { ...initialTenantState, tenants: mockTenants, loading: true };
      const state = tenantReducer(previousState, action);

      expect(state.loading).toBe(false);
      const found = state.tenants.find(t => t.id === 't1');
      expect(found?.name).toBe('Tenant 1 Updated');
      expect(state.tenants.find(t => t.id === 't2')).toEqual(mockTenant2); // Ensure other tenants are untouched
    });
  });

  describe('updateTenantFailure action', () => {
    it('should set error and set loading to false', () => {
      const error = { message: 'Failed to update tenant' };
      const action = TenantActions.updateTenantFailure({ error });
      const previousState: TenantState = { ...initialTenantState, tenants: mockTenants, loading: true };
      const state = tenantReducer(previousState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
      expect(state.tenants).toEqual(mockTenants); // Tenants list should be unchanged on failure
    });
  });
});
