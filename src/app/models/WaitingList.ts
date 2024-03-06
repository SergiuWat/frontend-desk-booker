import { Booking } from "./Booking";
import { Desk } from "./Desk";
import { Employee } from "./Employee";

export class Waitinglist{
    id: number;
    employeeId: number;
    employee: Employee;
    deskId: number;
    desk: Desk;
    bookingId: number;
    booking: Booking;  
}