import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/shared/components/login/login.component';
import { AuthGuard } from './modules/shared/guards/auth.guard';
import { AdminGuard } from './modules/shared/guards/admin.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'resident',
    loadChildren: () => import('./modules/resident/resident.module').then(m => m.ResidentModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
