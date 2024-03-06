import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/Employee';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  userEmail:string;
  employee: Employee;
  employeeName: string;
  departmentName: string;

  constructor(private employeeService: EmployeeService, private router: Router){
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.employee = response;
      this.employeeName = this.employee.fullName;
      this.departmentName = this.employee.department.departmentName;
    });
  }

  goToBookings(){
    this.router.navigate(['bookings']);
  }
}
