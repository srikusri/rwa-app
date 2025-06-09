import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { PaymentApprovalComponent } from './components/payment-approval/payment-approval.component';
import { ClassifiedApprovalComponent } from './components/classified-approval/classified-approval.component';
import { ComplaintManagementComponent } from './components/complaint-management/complaint-management.component';
import { AnnouncementManagementComponent } from './components/announcement-management/announcement-management.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserManagementComponent,
    PaymentApprovalComponent,
    ClassifiedApprovalComponent,
    ComplaintManagementComponent,
    AnnouncementManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule {}
