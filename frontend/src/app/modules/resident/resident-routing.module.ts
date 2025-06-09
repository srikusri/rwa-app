import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentSubmissionComponent } from './components/payment-submission/payment-submission.component';
import { PartyHallBookingComponent } from './components/party-hall-booking/party-hall-booking.component';
import { ClassifiedsComponent } from './components/classifieds/classifieds.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { RulesComponent } from './components/rules/rules.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';

const routes: Routes = [
  { path: 'payments', component: PaymentSubmissionComponent },
  { path: 'bookings', component: PartyHallBookingComponent },
  { path: 'classifieds', component: ClassifiedsComponent },
  { path: 'complaints', component: ComplaintsComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'announcements', component: AnnouncementsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResidentRoutingModule {}
