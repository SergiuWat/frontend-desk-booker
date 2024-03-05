import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/models/Department';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit{
  departments: Department[];
  employeeName: string;
  departmentName: string;

  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.employeeName = response.fullName;
      this.departmentName = response.department.departmentName;

      this.route.params.subscribe(params => {
        const floorId = +params['id'];
        this.departmentService.getDepartmentsByFloorID(floorId.toString()).subscribe(departments => {
          this.departments = departments
        });
      });
    });
  }

  isDepartmentEnabled(department: any): boolean {
    return department.departmentName === this.departmentName;
  }

  goToBooking(){
    this.router.navigate(['/desk-booking']);
  }

  goToFloors(){
    this.router.navigate(['/home']);
  }

}
