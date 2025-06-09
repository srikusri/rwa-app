import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { PaymentApprovalComponent } from './components/payment-approval/payment-approval.component';
import { ClassifiedApprovalComponent } from './components/classified-approval/classified-approval.component';
import { ComplaintManagementComponent } from './components/complaint-management/complaint-management.component';
import { AnnouncementManagementComponent } from './components/announcement-management/announcement-management.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: UserManagementComponent },
  { path: 'payments', component: PaymentApprovalComponent },
  { path: 'classifieds', component: ClassifiedApprovalComponent },
  { path: 'complaints', component: ComplaintManagementComponent },
  { path: 'announcements', component: AnnouncementManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
