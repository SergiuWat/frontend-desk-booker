import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/Employee';
import { EmployeeUpdatePictureModel } from 'src/app/models/EmployeeUpdatePictureModel';

import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  userEmail:string;
  employee: Employee;
  employeeToUpdate: EmployeeUpdatePictureModel;
  employeeName: string;
  departmentName: string;
  imageBlob: Blob;
  image: any;
  sanitizedImageData: any;
  teamName: string;
  rolName: string;
  employeeEmail: string
  contactNumber: string;
  //sanitizedImageData: any; // This will hold the image data
  selectedFile: File | null = null; // This will hold the selected file
  showChangeImageText: boolean = false; // To toggle visibility of the "Change Image" text

  @Input('profile-image') profileId: number;

  constructor(private employeeService: EmployeeService, private router: Router, private sanitizer: DomSanitizer){ }

  ngOnInit(): void{
    this.employeeService.getEmployeeInfo().subscribe(response => {
      this.employee = response;
      this.employeeName = this.employee.fullName;
      this.departmentName = this.employee.department.departmentName;
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

  
  openFileDialog(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.readImageFile();
    }
  }

  readImageFile(): void {
    this.employeeToUpdate = new EmployeeUpdatePictureModel();
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile as File);
    reader.onload = () => {
      this.sanitizedImageData = reader.result.slice(22, reader.result.toString().length);
      this.employeeToUpdate.imageData = this.sanitizedImageData;
      this.employeeToUpdate.id = this.employee.id;
      this.employeeToUpdate.fullName = this.employee.fullName;
      this.employeeToUpdate.email = this.employee.email;
      this.employeeToUpdate.rol = this.employee.rol;
      this.employeeToUpdate.team = this.employee.team;
      this.employeeToUpdate.departmentName = this.employee.department.departmentName;
      this.employeeToUpdate.floorId = this.employee.department.floor.id;
      this.employeeToUpdate.contact = this.employee.contact;
      
      this.employeeService.updateEmployee(this.employeeToUpdate).subscribe(response => {
        console.log(response);
        window.location.reload();
      });
    };
  }

  onMouseEnter() {
    console.log('Mouse entered');
    this.showChangeImageText = true;
  }
  
  onMouseLeave() {
    console.log('Mouse left');
    this.showChangeImageText = false;
  }
}
