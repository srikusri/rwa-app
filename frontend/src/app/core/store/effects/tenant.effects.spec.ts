import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TenantEffects } from './tenant.effects';
import * as TenantActions from '../actions/tenant.actions';
import { Tenant } from '../../models/tenant.model';

describe('TenantEffects', () => {
  let actions$: Observable<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  let effects: TenantEffects;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/tenants';

  const mockTenant1: Tenant = { id: 't1', name: 'Tenant 1', description: 'Desc 1', status: 'active' };
  const mockTenant2: Tenant = { id: 't2', name: 'Tenant 2', description: 'Desc 2', status: 'inactive' };
  const mockTenants: Tenant[] = [mockTenant1, mockTenant2];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TenantEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.inject(TenantEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  // Load Tenants Effect
  describe('loadTenants$', () => {
    it('should dispatch loadTenantsSuccess on successful API call', (done) => {
      actions$ = of(TenantActions.loadTenants());

      effects.loadTenants$.subscribe(action => {
        expect(action).toEqual(TenantActions.loadTenantsSuccess({ tenants: mockTenants }));
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTenants);
    });

    it('should dispatch loadTenantsFailure on API error', (done) => {
      const error = { status: 500, statusText: 'Server Error' };
      actions$ = of(TenantActions.loadTenants());

      effects.loadTenants$.subscribe(action => {
        expect(action).toEqual(TenantActions.loadTenantsFailure({ error }));
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(error, { status: 500, statusText: 'Server Error' }); // Simulate an error response
    });
  });

  // Create Tenant Effect
  describe('createTenant$', () => {
    const newTenantData = { name: 'New Tenant', description: 'New Desc' };
    const initialAdminUserId = 'adminId';
    const actionPayload = { tenant: newTenantData, initialAdminUserId };
    const expectedApiPayload = { ...newTenantData, initialAdminUserId };
    const createdTenant: Tenant = { ...newTenantData, id: 't3', status: 'active' };

    it('should dispatch createTenantSuccess on successful API call', (done) => {
      actions$ = of(TenantActions.createTenant(actionPayload));

      effects.createTenant$.subscribe(action => {
        expect(action).toEqual(TenantActions.createTenantSuccess({ tenant: createdTenant }));
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedApiPayload);
      req.flush(createdTenant);
    });

    it('should dispatch createTenantFailure on API error', (done) => {
      const error = { status: 500, statusText: 'Server Error' };
      actions$ = of(TenantActions.createTenant(actionPayload));

      effects.createTenant$.subscribe(action => {
        expect(action).toEqual(TenantActions.createTenantFailure({ error }));
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(error, { status: 500, statusText: 'Server Error' });
    });
  });

  // Update Tenant Effect
  describe('updateTenant$', () => {
    const tenantToUpdate: Partial<Tenant> & { id: string } = { id: 't1', name: 'Updated Name' };
    const actionPayload = { tenant: tenantToUpdate };
    const updatedTenant: Tenant = { ...mockTenant1, name: 'Updated Name' }; // Full tenant object returned by API

    it('should dispatch updateTenantSuccess on successful API call', (done) => {
      actions$ = of(TenantActions.updateTenant(actionPayload));

      effects.updateTenant$.subscribe(action => {
        expect(action).toEqual(TenantActions.updateTenantSuccess({ tenant: updatedTenant }));
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${tenantToUpdate.id}`);
      expect(req.request.method).toBe('PATCH');
      // Check that only the 'name' field is in the body, as per effect logic
      expect(req.request.body).toEqual({ name: tenantToUpdate.name });
      req.flush(updatedTenant);
    });

    it('should dispatch updateTenantSuccess with initialAdminUserId if provided', (done) => {
      const actionPayloadWithAdmin = { tenant: tenantToUpdate, initialAdminUserId: 'newAdmin' };
      actions$ = of(TenantActions.updateTenant(actionPayloadWithAdmin));

      effects.updateTenant$.subscribe(action => {
        expect(action).toEqual(TenantActions.updateTenantSuccess({ tenant: updatedTenant }));
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${tenantToUpdate.id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ name: tenantToUpdate.name, initialAdminUserId: 'newAdmin' });
      req.flush(updatedTenant);
    });


    it('should dispatch updateTenantFailure on API error', (done) => {
      const error = { status: 500, statusText: 'Server Error' };
      actions$ = of(TenantActions.updateTenant(actionPayload));

      effects.updateTenant$.subscribe(action => {
        expect(action).toEqual(TenantActions.updateTenantFailure({ error }));
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${tenantToUpdate.id}`);
      expect(req.request.method).toBe('PATCH');
      req.flush(error, { status: 500, statusText: 'Server Error' });
    });
  });
});
