import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProfileAbsenceDialogComponent } from './delete-profile-absence-dialog.component';

describe('DeleteProfileAbsenceDialogComponent', () => {
  let component: DeleteProfileAbsenceDialogComponent;
  let fixture: ComponentFixture<DeleteProfileAbsenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProfileAbsenceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteProfileAbsenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
