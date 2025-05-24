import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsStepsDialogComponent } from './details-steps-dialog.component';

describe('DetailsStepsDialogComponent', () => {
  let component: DetailsStepsDialogComponent;
  let fixture: ComponentFixture<DetailsStepsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsStepsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsStepsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
