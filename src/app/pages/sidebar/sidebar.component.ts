import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  imageBlob: Blob;
  image: any;
  sanitizedImageData: any;
  teamName: string;
  rolName: string;
  employeeEmail: string
  contactNumber: string;


  @Input('profile-image') profileId: number;

  constructor(private employeeService: EmployeeService, private router: Router, private sanitizer: DomSanitizer){ }

  ngOnInit(): void{
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.employee = response;
      this.employeeName = this.employee.fullName;
      this.departmentName = this.employee.department.departmentName;
      // let objectURL = URL.createObjectURL(this.employee.imageData);
      this.image = 'data:image/png;base64,' + this.employee.imageData;
      this.sanitizedImageData = this.sanitizer.bypassSecurityTrustUrl(this.image);
      this.teamName = this.employee.team;
      this.rolName = this.employee.rol;
      this.contactNumber = this.employee.contact;
      this.employeeEmail = this.employee.email;
    });
  }

  getImageUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.imageBlob));
  }

  goToBookings(){
    this.router.navigate(['bookings']);
  }

  goToHistory(){
    this.router.navigate(['history']);
  }
}
