import { DatePipe } from '@angular/common';
import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Desk } from 'src/app/models/Desk';
import { BookingDataService } from 'src/app/services/booking-data.service';
import { BookingService } from 'src/app/services/booking.service';
import { DeskService } from 'src/app/services/desk.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { BookingdialogComponent } from '../bookingdialog/bookingdialog.component';
import { DeskPositions } from 'src/app/models/DeskPositions';
import { DeskpositionsService } from 'src/app/services/deskpositions.service';
import { Separators } from 'src/app/models/Separators';
import { SeparatorsService } from 'src/app/services/separators.service';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.svg',
  styleUrls: ['./seats.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SeatsComponent),
      multi: true,
    },
  ],
})
export class SeatsComponent implements ControlValueAccessor, OnChanges{
  @Input() isVisible: boolean = false;
  @Input() desks: Desk[];
  isDeskBookedMap: Map<number, boolean> = new Map<number, boolean>();
  deskPositions: DeskPositions[];
  separators: Separators[];
  constructor(private bookingService: BookingService,
              private employeeService: EmployeeService,
              private bookingDataService: BookingDataService,
              private datePipe: DatePipe, 
              private sharedBookingData: BookingDataService,
              private deskPositionsService: DeskpositionsService,
              private separatorsService: SeparatorsService,
              private dialog: MatDialog){

            }

    
    
  async ngOnInit(){
    var employeeInfo = await this.employeeService.getEmployeeInfo().toPromise();
    this.deskPositionsService.getAllDeskPositionsByDepartment(employeeInfo.department.id).subscribe(response => {
      this.deskPositions = response;
      console.log();
    });
    this.separatorsService.getSeparatorsByDepartmentId(employeeInfo.department.id).subscribe(response => {
      this.separators = response;
      console.log();
    });

  }
  public onTouched = () => {};
  public onChange = (value: string) => {};
  public touched: boolean = false;
  public isDisabled: boolean = false;
  public value: string = '';

  public select(option: string): void {
    if (!this.isDisabled) {
      if (this.isSelected(option)) {
        this.value = '';
      } else {
        this.value = option;
        const deskId = this.extractDeskId(option);
        this.openBookingDialog(deskId);
      }
      this.onChange(this.value);
      this.markAsTouched();
    }
  }

  private openBookingDialog(deskId: number): void {
    const dialogRef = this.dialog.open(BookingdialogComponent, {
        width: '600px',
        height: '270px',
        data: { deskId: deskId, bookingData: this.bookingDataService.bookingData}
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
            this.addBooking(deskId);
        } else {
          this.updateSeats();
        }
    });
}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.desks && changes.desks.currentValue) {
      this.desks = changes.desks.currentValue;
      this.updateSeats()
    }
  }

  resetIsDeskBookedMap() {
    this.isDeskBookedMap = new Map<number, boolean>();
  }
  

  updateSeats(): void {
    this.resetIsDeskBookedMap();
    if (this.desks) {
      this.bookingService.getAllBookedDesksByDay(this.sharedBookingData.bookingData.startDate, this.sharedBookingData.bookingData.endDate).subscribe(bookings =>{
        this.desks.forEach(desk =>{
          var obj = bookings.find((booking) => (booking.deskId === desk.id && ( this.datePipe.transform(booking.startDate, 'yyyy-MM-dd') <= this.sharedBookingData.bookingData.endDate ) && ( this.datePipe.transform(booking.endDate, 'yyyy-MM-dd') >= this.sharedBookingData.bookingData.startDate ) && ( this.datePipe.transform(booking.startDate))))
          if(obj != undefined){
            this.isDeskBookedMap.set(desk.id, true) ;
          } else {
            this.isDeskBookedMap.set(desk.id, false);
          }
        })
        
        if(this.desks != undefined){
          this.desks.forEach(desk => {
            const seatElement = document.getElementById(`seat-${desk.id}`);
            if (seatElement) {
                const isAvailable = this.checkDeskAvailability(desk.id);
                seatElement.style.fill = isAvailable ? 'red' : '#0cc';
                seatElement.style.pointerEvents = isAvailable ? 'none' : 'auto';
            }
        });}
      });
    }
  }

  async addBooking(deskId:number){
    var response = await this.employeeService.getEmployeeInfo().toPromise()
    this.bookingDataService.bookingData.employeeId=response.id;
    this.bookingDataService.bookingData.deskId=deskId;
    this.bookingService.addBooking(this.bookingDataService.bookingData).subscribe();
    window.location.reload();    
  }

  private extractDeskId(option: string): number {
    return parseInt(option.split('-')[1]);
  }

  checkDeskAvailability(deskId: number): boolean {
    return this.isDeskBookedMap.get(deskId) || false;
  }

  public isSelected(option: string): boolean {
    return option === this.value;
  }

  writeValue(value: string): void {
    this.value = value;
  }
  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  public resetSeats(): void {
    this.value = '';
    this.touched = false;
    this.onChange(this.value);
    
    this.desks.forEach(desk => {
      const seatElement = document.getElementById(`seat-${desk.id}`);
      if (seatElement) {
        seatElement.style.pointerEvents = 'none';
        seatElement.style.fill = '#0cc'
      }
    });
  }

  public resetWhenDateIsNotValid(): void {
    this.value = '';
    this.touched = false;
    this.onChange(this.value);
    
    this.desks.forEach(desk => {
      const seatElement = document.getElementById(`seat-${desk.id}`);
      if (seatElement) {
        seatElement.style.pointerEvents = 'none';
        seatElement.style.fill = '#FFF'
      }
    });
  }

  
}
