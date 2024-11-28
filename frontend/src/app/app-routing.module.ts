import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnregisteredComponent } from './common/unregistered/unregistered.component';
import { UserLoginComponent } from './common/user-login/user-login.component';
import { RegisterComponent } from './common/register/register.component';
import { CredentialsChangeComponent } from './common/credentials-change/credentials-change.component';
import { OwnerBaseComponent } from './users/owner/owner-base/owner-base.component';
import { DecoratorBaseComponent } from './users/decorator/decorator-base/decorator-base.component';
import { AdminLoginComponent } from './users/admin/admin-login/admin-login.component';
import { AdminBaseComponent } from './users/admin/admin-base/admin-base.component';
import { OwnerProfileComponent } from './users/owner/owner-profile/owner-profile.component';
import { OwnerFirmsComponent } from './users/owner/owner-firms/owner-firms.component';
import { OwnerMakeAppointmentComponent } from './users/owner/owner-make-appointment/owner-make-appointment.component';
import { OwnerMaintenanceComponent } from './users/owner/owner-maintenance/owner-maintenance.component';
import { DecoratorMakeAppointmentComponent } from './users/decorator/decorator-make-appointment/decorator-make-appointment.component';
import { DecoratorProfileComponent } from './users/decorator/decorator-profile/decorator-profile.component';
import { DecoratorStatisticsComponent } from './users/decorator/decorator-statistics/decorator-statistics.component';
import { DecoratorMaintenanceComponent } from './users/decorator/decorator-maintenance/decorator-maintenance.component';
import { AdminProfileComponent } from './users/admin/admin-profile/admin-profile.component';
import { AdminRequestsComponent } from './users/admin/admin-requests/admin-requests.component';
import { AdminNewDecoratorComponent } from './users/admin/admin-new-decorator/admin-new-decorator.component';
import { AdminNewFirmComponent } from './users/admin/admin-new-firm/admin-new-firm.component';
import { OwnerFirmDetailsComponent } from './users/owner/owner-firm-details/owner-firm-details.component';

const routes: Routes = [
  { path : "", component : UnregisteredComponent},
  { path : "login", component : UserLoginComponent},
  { path : "register", component : RegisterComponent},
  { path : "credentials-change", component : CredentialsChangeComponent },
  {
    path: 'owner',
    component: OwnerBaseComponent,
    children: [
      { path: 'profile', component: OwnerProfileComponent },  // Show Profile by default
      { path: 'firms', component: OwnerFirmsComponent },
      { path: 'firm-details', component: OwnerFirmDetailsComponent },
      { path: 'make-appointment', component: OwnerMakeAppointmentComponent },
      { path: 'maintenance', component: OwnerMaintenanceComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }  // Redirect to profile by default
    ]
  },
  {
    path: 'decorator',
    component: DecoratorBaseComponent,
    children: [
      { path: 'profile', component: DecoratorProfileComponent },  // Show Profile by default
      { path: 'maintenance', component: DecoratorMaintenanceComponent },
      { path: 'make-appointment', component: DecoratorMakeAppointmentComponent },
      { path: 'statistics', component: DecoratorStatisticsComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }  // Redirect to profile by default
    ]
  },
  {
    path: 'admin/base',
    component: AdminBaseComponent,
    children: [
      { path: 'profile', component: AdminProfileComponent },  // Show Profile by default
      { path: 'requests', component: AdminRequestsComponent },
      { path: 'new-decorator', component: AdminNewDecoratorComponent },
      { path: 'new-firm', component: AdminNewFirmComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }  // Redirect to profile by default
    ]
  },
  { path: "admin", component: AdminLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
