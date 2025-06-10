import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { PaymentApprovalComponent } from './components/payment-approval/payment-approval.component';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { ClassifiedApprovalComponent } from './components/classified-approval/classified-approval.component';
import { ComplaintManagementComponent } from './components/complaint-management/complaint-management.component';
import { AnnouncementManagementComponent } from './components/announcement-management/announcement-management.component';
import { TenantListComponent } from './components/tenant-management/tenant-list.component'; // Import TenantListComponent
import { TenantFormComponent } from './components/tenant-management/tenant-form.component'; // Import TenantFormComponent

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserManagementComponent,
    PaymentApprovalComponent,
    ClassifiedApprovalComponent,
    ComplaintManagementComponent,
    AnnouncementManagementComponent,
    TenantListComponent, // Declare TenantListComponent
    TenantFormComponent  // Declare TenantFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule // Add ReactiveFormsModule to imports
  ]
})
export class AdminModule {}
