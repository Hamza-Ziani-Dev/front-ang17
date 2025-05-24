import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsToDosComponent } from './steps-to-dos.component';

describe('StepsToDosComponent', () => {
  let component: StepsToDosComponent;
  let fixture: ComponentFixture<StepsToDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepsToDosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepsToDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
