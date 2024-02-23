import { NgModule } from '@angular/core';
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
    BookingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
