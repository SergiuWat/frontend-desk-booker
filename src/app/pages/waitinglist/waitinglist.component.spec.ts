import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaitinglistComponent } from './waitinglist.component';

describe('WaitinglistComponent', () => {
  let component: WaitinglistComponent;
  let fixture: ComponentFixture<WaitinglistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaitinglistComponent]
    });
    fixture = TestBed.createComponent(WaitinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
