import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GenerateCode } from 'src/app/models/GenerateCode';
import { Login } from 'src/app/models/Login';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.css']
})
export class SendMailComponent implements OnInit {
  form!:FormGroup;
  showMessage: boolean = false;
  
  constructor(private formBuilder:FormBuilder,private loginService:LoginService, private router:Router, ){
    this.form = this.formBuilder.group({
      email:['',Validators.required]
    })
  } 

  ngOnInit(){


  }
  sendCode(sendCodeForm: NgForm){
    let email: GenerateCode = sendCodeForm.value;
   
    this.loginService.generateCode(email).subscribe((response:any)=>{
      this.showMessage = true;
      this.router.navigate(['/email-sent']);
    },(err)=>{
        alert("There was an error with our server, please try again later!");
    });
  }
}
