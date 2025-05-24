import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsStepComponent } from './instructions-step.component';

describe('InstructionsStepComponent', () => {
  let component: InstructionsStepComponent;
  let fixture: ComponentFixture<InstructionsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionsStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructionsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
