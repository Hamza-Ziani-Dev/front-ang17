import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordereauDialogComponent } from './bordereau-dialog.component';

describe('BordereauDialogComponent', () => {
  let component: BordereauDialogComponent;
  let fixture: ComponentFixture<BordereauDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BordereauDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BordereauDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
