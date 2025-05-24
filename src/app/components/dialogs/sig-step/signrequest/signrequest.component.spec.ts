import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignrequestComponent } from './signrequest.component';

describe('SignrequestComponent', () => {
  let component: SignrequestComponent;
  let fixture: ComponentFixture<SignrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignrequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
