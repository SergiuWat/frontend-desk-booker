import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/models/Department';
import { Employee } from 'src/app/models/Employee';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { 

  userEmail:string;
  employee: Employee;
  employeeName: string;
  departmentName: string;
  showLogout:boolean;
  departments: Department[];

  disableFloor1Button: boolean = false;
  disableFloor2Button: boolean = false;
  disableFloor3Button: boolean = false;
  disableFloor4Button: boolean = false;

  constructor(private route: ActivatedRoute,private router: Router, private employeeService: EmployeeService, private departmentsService: DepartmentService) {}

  ngOnInit(){

    //Colectez informatiile de la employee folosind token-ul
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.employee = response;
      this.employeeName = this.employee.fullName;
      this.departmentName = this.employee.department.departmentName;
      this.showLogout=true;
      var empNameHeader = document.getElementById('employeeNameHeader');
      empNameHeader.innerText = ", " + this.employeeName.split(" ").at(0);

      // Colectez o lista de etaje disponibile pentru departamentul respectiv     
      this.departmentsService.getFloorsByDepartmentName(this.departmentName).subscribe(response => {
        this.departments = response;
         //Posibila optimizare folosind id-uri in html
        this.departments.forEach(d =>{

          // Dau enable la butoanele pentru departament
          if(d.floor.floorLevel === 1)
          {
            this.disableFloor1Button = true;
          }
          else if(d.floor.floorLevel === 2)
          {
            this.disableFloor2Button = true;
          }
          else if(d.floor.floorLevel === 3)
          {
            this.disableFloor3Button = true;
          }
          else if(d.floor.floorLevel === 4)
          {
            this.disableFloor4Button = true;
          }
        })

      });
    },(err)=>{
      this.router.navigate(["login"]).then(()=>{
        window.location.reload();
      });
    });

  }

  navigateToDepartments(floorId: number) {
    this.router.navigate(['/floors', floorId, 'departments']);
  }
}
