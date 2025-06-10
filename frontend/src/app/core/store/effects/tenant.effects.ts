import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Make sure HttpClient is available/imported
import { Tenant } from '../../models/tenant.model';
import * as TenantActions from '../actions/tenant.actions';

@Injectable()
export class TenantEffects {
  private apiUrl = 'http://localhost:3000/tenants'; // Base URL for tenant APIs

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  loadTenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TenantActions.loadTenants),
      mergeMap(() => // Or switchMap if only latest request matters
        this.http.get<Tenant[]>(this.apiUrl).pipe(
          map(tenants => TenantActions.loadTenantsSuccess({ tenants })),
          catchError(error => of(TenantActions.loadTenantsFailure({ error })))
        )
      )
    )
  );

  createTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TenantActions.createTenant),
      mergeMap(action =>
        this.http.post<Tenant>(this.apiUrl, {
          name: action.tenant.name,
          description: action.tenant.description,
          initialAdminUserId: action.initialAdminUserId
        }).pipe(
          map(tenant => TenantActions.createTenantSuccess({ tenant })),
          catchError(error => of(TenantActions.createTenantFailure({ error })))
        )
      )
    )
  );

  updateTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TenantActions.updateTenant),
      mergeMap(action => {
        // Construct payload, only send fields that are meant to be updated by this action
        const payload: any = {
          name: action.tenant.name,
          description: action.tenant.description,
          status: action.tenant.status
        };
        if (action.initialAdminUserId !== undefined) {
          payload.initialAdminUserId = action.initialAdminUserId;
        }
        // Remove undefined fields from payload to avoid sending them
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        return this.http.patch<Tenant>(`${this.apiUrl}/${action.tenant.id}`, payload).pipe(
          map(tenant => TenantActions.updateTenantSuccess({ tenant })), // Backend should return the updated tenant
          catchError(error => of(TenantActions.updateTenantFailure({ error })))
        );
      })
    )
  );
}
