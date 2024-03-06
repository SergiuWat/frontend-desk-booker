import { Component } from '@angular/core';
import { Waitinglist } from 'src/app/models/WaitingList';
import { WaitingListService } from 'src/app/services/waiting-list.service';

@Component({
  selector: 'app-waitinglist',
  templateUrl: './waitinglist.component.html',
  styleUrls: ['./waitinglist.component.css']
})
export class WaitinglistComponent {

  waitingLists: Waitinglist[];
  constructor(private waitingListService: WaitingListService){}

  ngOnInit(){
    this.waitingListService.getWaitingListForCurrentEmployee().subscribe(response =>{
      this.waitingLists = response;
      console.log(this.waitingLists[0].deskId);
    })
    console.log("Hey");
  }
}
