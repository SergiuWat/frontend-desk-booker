import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SendMailComponent } from './pages/send-mail/send-mail.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { EmailSentComponent } from './email-sent/email-sent.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { DeskbookingComponent } from './pages/deskbooking/deskbooking.component';
import { WaitinglistComponent } from './pages/waitinglist/waitinglist.component';
import { HistoryComponent } from './pages/history/history.component';


const routes: Routes = [
  {path:"login", component: LoginComponent},
  {path:"home", component: HomeComponent},
  {path:"send-mail", component: SendMailComponent},
  {path:"email-sent", component: EmailSentComponent},
  {path:"reset-password", component: ResetPasswordComponent},
  {path:"floors/:id/departments", component: DepartmentsComponent},
  {path:"bookings", component: BookingsComponent},
  {path:"history", component: HistoryComponent},
  {path:"desk-booking/:id", component: DeskbookingComponent},
  {path: "waitinglist", component: WaitinglistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
