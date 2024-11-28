import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UnregisteredComponent } from './common/unregistered/unregistered.component';
import { UserLoginComponent } from './common/user-login/user-login.component';
import { RegisterComponent } from './common/register/register.component';
import { CredentialsChangeComponent } from './common/credentials-change/credentials-change.component';
import { OwnerBaseComponent } from './users/owner/owner-base/owner-base.component';
import { DecoratorBaseComponent } from './users/decorator/decorator-base/decorator-base.component';
import { AdminBaseComponent } from './users/admin/admin-base/admin-base.component';
import { AdminLoginComponent } from './users/admin/admin-login/admin-login.component';
import { OwnerProfileComponent } from './users/owner/owner-profile/owner-profile.component';
import { DecoratorProfileComponent } from './users/decorator/decorator-profile/decorator-profile.component';
import { AdminProfileComponent } from './users/admin/admin-profile/admin-profile.component';
import { AdminCredentialsChangeComponent } from './users/admin/admin-credentials-change/admin-credentials-change.component';
import { AdminNewFirmComponent } from './users/admin/admin-new-firm/admin-new-firm.component';
import { AdminNewDecoratorComponent } from './users/admin/admin-new-decorator/admin-new-decorator.component';
import { AdminRequestsComponent } from './users/admin/admin-requests/admin-requests.component';
import { OwnerFirmsComponent } from './users/owner/owner-firms/owner-firms.component';
import { OwnerFirmDetailsComponent } from './users/owner/owner-firm-details/owner-firm-details.component';
import { OwnerMakeAppointmentComponent } from './users/owner/owner-make-appointment/owner-make-appointment.component';
import { DecoratorMakeAppointmentComponent } from './users/decorator/decorator-make-appointment/decorator-make-appointment.component';
import { OwnerMaintenanceComponent } from './users/owner/owner-maintenance/owner-maintenance.component';
import { DecoratorMaintenanceComponent } from './users/decorator/decorator-maintenance/decorator-maintenance.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UnregisteredComponent,
    RegisterComponent,
    CredentialsChangeComponent,
    OwnerBaseComponent,
    DecoratorBaseComponent,
    AdminBaseComponent,
    AdminLoginComponent,
    OwnerProfileComponent,
    DecoratorProfileComponent,
    AdminProfileComponent,
    AdminCredentialsChangeComponent,
    AdminNewFirmComponent,
    AdminNewDecoratorComponent,
    AdminRequestsComponent,
    OwnerFirmsComponent,
    OwnerFirmDetailsComponent,
    OwnerMakeAppointmentComponent,
    DecoratorMakeAppointmentComponent,
    OwnerMaintenanceComponent,
    DecoratorMaintenanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
