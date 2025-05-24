import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmeStepComponent } from './confirme-step.component';

describe('ConfirmeStepComponent', () => {
  let component: ConfirmeStepComponent;
  let fixture: ComponentFixture<ConfirmeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmeStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
