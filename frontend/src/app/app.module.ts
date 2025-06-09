import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './core/store/reducers';
import { AppEffects } from './core/store/effects';
import { HttpClientModule } from '@angular/common/http';
import { tenantReducer } from './core/store/reducers/tenant.reducer'; // Import tenant reducer
import { TenantEffects } from './core/store/effects/tenant.effects'; // Import tenant effects

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    StoreModule.forRoot({
      app: reducer, // Existing app reducer
      tenants: tenantReducer // Register tenant reducer
    }),
    EffectsModule.forRoot([AppEffects, TenantEffects]) // Add TenantEffects
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
