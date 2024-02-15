import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.css']
})
export class EmailSentComponent {

  constructor(private router:Router){

  }

  headToReset(){
    this.router.navigate(['/reset-password']);
  }


}
