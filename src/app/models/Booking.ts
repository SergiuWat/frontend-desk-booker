import { Department } from "./Department";
import { Desk } from "./Desk";

export class Booking {
    id: number;
    employeeId: number;
    deskId: number;
    startDate: string;
    endDate: string;
    desk: Desk;
    department: Department;
}