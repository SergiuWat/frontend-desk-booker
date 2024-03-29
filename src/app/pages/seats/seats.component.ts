import { DatePipe } from '@angular/common';
import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Desk } from 'src/app/models/Desk';
import { BookingDataService } from 'src/app/services/booking-data.service';
import { BookingService } from 'src/app/services/booking.service';
import { DeskService } from 'src/app/services/desk.service';
import { EmployeeService } from 'src/app/services/employee.service';

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

  constructor(private bookingService: BookingService,
              private employeeService: EmployeeService,
              private bookingDataService: BookingDataService,
              private datePipe: DatePipe, 
              private sharedBookingData: BookingDataService,  ){

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
      }
      this.onChange(this.value);
      this.markAsTouched();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.desks && changes.desks.currentValue) {
      this.desks = changes.desks.currentValue;
      this.updateSeats()
    }
  }
  

  updateSeats(): void {
    if (this.desks) {
      this.bookingService.getAllBookedDesksByDay(this.sharedBookingData.bookingData.startDate, this.sharedBookingData.bookingData.endDate).subscribe(bookings =>{
        this.desks.forEach(desk =>{
          var obj = bookings.find((booking) => (booking.deskId === desk.id && ( this.datePipe.transform(booking.startDate, 'yyyy-MM-dd') <= this.sharedBookingData.bookingData.endDate ) && ( this.datePipe.transform(booking.endDate, 'yyyy-MM-dd') >= this.sharedBookingData.bookingData.startDate ) && ( this.datePipe.transform(booking.startDate))))
          if(obj != undefined){
            this.isDeskBookedMap.set(desk.id, true);
          } else {
            this.isDeskBookedMap.set(desk.id, false);
          }
        })
        this.desks.forEach(desk => {
          const seatElement = document.getElementById(`seat-${desk.deskNumber}`);
          if (seatElement) {
              const isAvailable = this.checkDeskAvailability(desk.deskNumber);
              seatElement.setAttribute('fill', isAvailable ? '#ccc' : '#fff');
              seatElement.style.pointerEvents = isAvailable ? 'none' : 'auto';
          }
        });
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
}
