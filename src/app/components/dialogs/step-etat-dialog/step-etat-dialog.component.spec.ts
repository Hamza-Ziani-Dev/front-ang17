import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEtatDialogComponent } from './step-etat-dialog.component';

describe('StepEtatDialogComponent', () => {
  let component: StepEtatDialogComponent;
  let fixture: ComponentFixture<StepEtatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepEtatDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepEtatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
