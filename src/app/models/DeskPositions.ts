import { Department } from "./Department";
import { Desk } from "./Desk";

export class DeskPositions {
    id: number;
    translateTableX: number;
    translateTableY: number;
    translateScreenX: number;
    translateScreenY: number;
    translateChairX: number;
    translateChairY: number;
    department: Department;
    desk: Desk;
}