import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/header/header.component';
import { SendMailComponent } from './pages/send-mail/send-mail.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { EmailSentComponent } from './email-sent/email-sent.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { AngularMaterialModule } from './angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { DeskbookingComponent } from './pages/deskbooking/deskbooking.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { WaitinglistComponent } from './pages/waitinglist/waitinglist.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    SendMailComponent,
    ResetPasswordComponent,
    EmailSentComponent,
    SidebarComponent,
    DepartmentsComponent,
    BookingsComponent,
    DeskbookingComponent,
    WaitinglistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatNativeDateModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
