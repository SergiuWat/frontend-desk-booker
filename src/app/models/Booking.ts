import { Desk } from "./Desk";
import { Employee } from "./Employee";

export class Booking{
    id: number;
    employeeId: number;
    employee: Employee;
    deskId: number;
    desk: Desk;
    bookedDay: Date;
}