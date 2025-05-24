import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfileAbsenceDialogComponent } from './add-profile-absence-dialog.component';

describe('AddProfileAbsenceDialogComponent', () => {
  let component: AddProfileAbsenceDialogComponent;
  let fixture: ComponentFixture<AddProfileAbsenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProfileAbsenceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProfileAbsenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
