import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSuccessDialogComponent } from './update-success-dialog.component';

describe('UpdateSuccessDialogComponent', () => {
  let component: UpdateSuccessDialogComponent;
  let fixture: ComponentFixture<UpdateSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSuccessDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
