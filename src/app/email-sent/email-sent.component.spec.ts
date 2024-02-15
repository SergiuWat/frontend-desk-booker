import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EmailSentComponent } from './email-sent.component';

describe('EmailSentComponent', () => {
  let component: EmailSentComponent;
  let fixture: ComponentFixture<EmailSentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailSentComponent]
    });
    fixture = TestBed.createComponent(EmailSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login',()=>{
      const router = TestBed.inject(Router);
      spyOn(router,'navigateByUrl');

      component.headToLogin();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        jasmine.stringMatching('/login'),
        jasmine.objectContaining({ skipLocationChange: false })
      )
  })
});
