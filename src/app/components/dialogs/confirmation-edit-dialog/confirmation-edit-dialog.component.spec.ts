import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationEditDialogComponent } from './confirmation-edit-dialog.component';

describe('ConfirmationEditDialogComponent', () => {
  let component: ConfirmationEditDialogComponent;
  let fixture: ComponentFixture<ConfirmationEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmationEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
