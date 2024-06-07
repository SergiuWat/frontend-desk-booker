import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

   holidaysByRegion: { [key: string]: Date[] } = {
    'Romania': this.getHolidaysForRomania(new Date().getFullYear()),
    'Germany': this.getHolidaysForGermany(new Date().getFullYear())
    
  };

  getHolidaysForRegion(region: string, year: number): Date[] {
    if (!this.holidaysByRegion[region]) {
      return [];
    }
    return this.holidaysByRegion[region];
  }

  addRegion(region: string, holidays: Date[]): void {
    this.holidaysByRegion[region] = holidays;
  }

   getHolidaysForRomania(year: number): Date[] {
    const holidays = [
      new Date(year, 0, 1), 
      new Date(year, 0, 2), 
      new Date(year, 0, 6),
      new Date(year, 0, 7),
      new Date(year, 0, 24), 
      new Date(year, 4, 1), 
      new Date(year, 5, 1),
      new Date(year, 5, 23),
      new Date(year, 5, 24), 
      new Date(year, 7, 15), 
      new Date(year, 10, 30), 
      new Date(year, 11, 1), 
      new Date(year, 11, 25), 
      new Date(year, 11, 26)  
    ];    

    const easterSunday = this.calculateOrthodoxEaster(year);
    holidays.push(
      easterSunday, 
      new Date(easterSunday.getTime() + 1 * 24 * 60 * 60 * 1000), 
      new Date(easterSunday.getTime() - 2 * 24 * 60 * 60 * 1000), 
      new Date(easterSunday.getTime() + 50 * 24 * 60 * 60 * 1000), 
      new Date(easterSunday.getTime() + 51 * 24 * 60 * 60 * 1000)  
    );

    return holidays;
  }



  getHolidaysForGermany(year: number): Date[] {
    const easterSunday = this.calculateCatholicEasterSunday(year);
    const easterMonday = new Date(easterSunday.getTime() + 1 * 24 * 60 * 60 * 1000); 
    const goodFriday = new Date(easterSunday.getTime() - 2 * 24 * 60 * 60 * 1000); 
    const holidays = [
    new Date(year, 0, 1),   
    new Date(year, 0, 6),   
    new Date(year, 4, 1),   
    new Date(year, 4, 21),  
    new Date(year, 11, 25), 
    new Date(year, 11, 26), 
    new Date(year, 4, 31), 
    new Date(year, 9, 3),   
    new Date(year, 11, 25),
    new Date(year, 11, 26),
    easterSunday,
    easterMonday,
    goodFriday  
    ];

    return holidays;
    
  }

   calculateCatholicEasterSunday(year: number): Date {
    const G = (year % 19) + 1;
    const C = Math.floor(year / 100);
    const H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
    const I = H - Math.floor(H / 28) * (1 - Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
    const J = (year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
    const L = I - J;
    const month = 3 + Math.floor((L + 40) / 44);
    const day = L + 28 - 31 * Math.floor(month / 4);
  
    return new Date(year, month - 1, day);
  }

   calculateOrthodoxEaster(year: number): Date {
    const a = year % 19;
    const b = year % 7;
    const c = year % 4;
    const d = (19 * a + 16) % 30;
    const e = (2 * c + 4 * b + 6 * d) % 7;
    const f = d + e;

    const day = f < 10 ? f + 22 : f - 9;
    const month = f < 10 ? 3 : 4;

    return new Date(year, month, day);
  }
}
