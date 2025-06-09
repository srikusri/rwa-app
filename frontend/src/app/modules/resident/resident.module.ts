import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidentRoutingModule } from './resident-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PaymentSubmissionComponent } from './components/payment-submission/payment-submission.component';
import { PartyHallBookingComponent } from './components/party-hall-booking/party-hall-booking.component';
import { ClassifiedsComponent } from './components/classifieds/classifieds.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { RulesComponent } from './components/rules/rules.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PaymentSubmissionComponent,
    PartyHallBookingComponent,
    ClassifiedsComponent,
    ComplaintsComponent,
    RulesComponent,
    AnnouncementsComponent
  ],
  imports: [
    CommonModule,
    ResidentRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ResidentModule {}
