import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePassword } from 'src/app/models/ChangePassword';
import { GenerateCode } from 'src/app/models/GenerateCode';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form!:FormGroup;
  showMessage: boolean = false;
  
  constructor(private formBuilder:FormBuilder,private loginService:LoginService, private router:Router, ){
    this.form = this.formBuilder.group({
      email:['',Validators.required]
    })
  } 

  ngOnInit(){


  }
  resetPassword(resetForm: NgForm){
    let data: ChangePassword = resetForm.value;
   
    this.loginService.verifyCode(data).subscribe((response:any)=>{
      this.showMessage = true;
      this.router.navigate(['/login']);
    },(err)=>{
        alert("There was an error with our server, please try again later!");
    });
  }

}
