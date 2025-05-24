import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuccessDialogComponent } from './add-success-dialog.component';

describe('AddSuccessDialogComponent', () => {
  let component: AddSuccessDialogComponent;
  let fixture: ComponentFixture<AddSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSuccessDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
