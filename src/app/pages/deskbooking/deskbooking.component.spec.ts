import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskbookingComponent } from './deskbooking.component';

describe('DeskbookingComponent', () => {
  let component: DeskbookingComponent;
  let fixture: ComponentFixture<DeskbookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeskbookingComponent]
    });
    fixture = TestBed.createComponent(DeskbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
