import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileAbsenceDialogComponent } from './update-profile-absence-dialog.component';

describe('UpdateProfileAbsenceDialogComponent', () => {
  let component: UpdateProfileAbsenceDialogComponent;
  let fixture: ComponentFixture<UpdateProfileAbsenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfileAbsenceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProfileAbsenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
