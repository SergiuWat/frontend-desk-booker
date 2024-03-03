import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Login } from 'src/app/models/Login';
import { ActivatedRoute, Router } from '@angular/router'; 
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form!:FormGroup;
  invalidCredentialsError:boolean = false;
  passwordVisible!:boolean;
  showWrongCredentials: boolean = false;
  
  constructor(private formBuilder:FormBuilder,private loginService:LoginService, private router:Router, private snackBar: MatSnackBar){
    this.form = this.formBuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]
    })
  } 

  ngOnInit(){


  }
  signin(loginForm: NgForm){
    let user: Login = loginForm.value;
   
    this.loginService.login(user).subscribe((response:any)=>{
      localStorage.setItem("ACCESS_TOKEN", response["accessToken"]);
      localStorage.setItem("REFRESH_TOKEN", response["refreshToken"]);
      this.router.navigate(['home']).then(()=>{
        window.location.reload();
      });
     
    },(err)=>{
      if(err.status == 403)
      {
        this.showWrongCredentials=true;
      } else if(err.status == 401){
        this.showWrongCredentials=true;
      } else {
        alert("There was an error with our server, please try again later!");
        this.showWrongCredentials=true;
      }
    });
  }
}
