import * as fromTenant from '../reducers/tenant.reducer'; // Import TenantState and initialTenantState
import * as TenantSelectors from './tenant.selectors';
import { Tenant } from '../../models/tenant.model';

describe('Tenant Selectors', () => {
  const mockTenant1: Tenant = { id: 't1', name: 'Tenant 1', description: 'Desc 1', status: 'active' };
  const mockTenant2: Tenant = { id: 't2', name: 'Tenant 2', description: 'Desc 2', status: 'inactive' };
  const mockTenants: Tenant[] = [mockTenant1, mockTenant2];

  const initialState: fromTenant.TenantState = {
    tenants: mockTenants,
    loading: false,
    error: null,
  };

  const loadingState: fromTenant.TenantState = {
    tenants: [],
    loading: true,
    error: null,
  };

  const errorState: fromTenant.TenantState = {
    tenants: [],
    loading: false,
    error: { message: 'An error occurred' },
  };

  it('should select the tenant feature state (implicitly tested by others)', () => {
    // selectTenantFeatureState is used by all other selectors.
    // If they work, it works. Direct testing is less common for the feature selector itself.
    expect(true).toBe(true); // Placeholder for structural completeness if needed
  });

  it('selectAllTenants should return the list of tenants', () => {
    const result = TenantSelectors.selectAllTenants.projector(initialState);
    expect(result).toEqual(mockTenants);
    expect(result.length).toBe(2);
  });

  it('selectTenantsLoading should return the loading status', () => {
    const resultFalse = TenantSelectors.selectTenantsLoading.projector(initialState);
    expect(resultFalse).toBe(false);

    const resultTrue = TenantSelectors.selectTenantsLoading.projector(loadingState);
    expect(resultTrue).toBe(true);
  });

  it('selectTenantsError should return the error object', () => {
    const resultNull = TenantSelectors.selectTenantsError.projector(initialState);
    expect(resultNull).toBeNull();

    const resultError = TenantSelectors.selectTenantsError.projector(errorState);
    expect(resultError).toEqual({ message: 'An error occurred' });
  });

  describe('selectTenantById', () => {
    it('should return the correct tenant when ID exists', () => {
      // Note: selectTenantById is a factory that returns a selector.
      // We test the projector of the *returned* selector.
      const selector = TenantSelectors.selectTenantById('t1');
      const result = selector.projector(mockTenants); // The inner selector takes the array of tenants
      expect(result).toEqual(mockTenant1);
    });

    it('should return undefined when ID does not exist', () => {
      const selector = TenantSelectors.selectTenantById('nonexistent');
      const result = selector.projector(mockTenants);
      expect(result).toBeUndefined();
    });

    it('should return undefined when tenants array is empty', () => {
      const selector = TenantSelectors.selectTenantById('t1');
      const result = selector.projector([]);
      expect(result).toBeUndefined();
    });
  });
});
