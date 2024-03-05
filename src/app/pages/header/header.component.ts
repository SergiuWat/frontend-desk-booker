import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/Employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  showLogout: boolean = false;
  showHello: boolean = false;
  employee: Employee;
  employeeName: string
  constructor(private employeeService: EmployeeService, private router: Router){}
  ngOnInit(){
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.showHello = true;
      this.showLogout = true;
      this.employee = response;
      this.employeeName = this.employee.fullName.split(' ').at(0);
    });
  }

  logout(){
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('REFRESH_TOKEN');
    this.router.navigate(['/login']).then(()=>{
      window.location.reload();
    });
  }

  goToHome(){
    this.router.navigate(['/home']);
  }
  login(){
    this.router.navigate(["login"]).then(()=>{
      window.location.reload();
    })
  }
}
