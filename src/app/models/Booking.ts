import { Department } from "./Department";
import { Desk } from "./Desk";

export class Booking {
    id: number;
    employeeId: number;
    deskId: number;
    bookedDay: string;
    desk: Desk;
    department: Department;
}