import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigStepComponent } from './sig-step.component';

describe('SigStepComponent', () => {
  let component: SigStepComponent;
  let fixture: ComponentFixture<SigStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SigStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
