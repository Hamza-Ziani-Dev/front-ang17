import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationResultDialogComponent } from './operation-result-dialog.component';

describe('OperationResultDialogComponent', () => {
  let component: OperationResultDialogComponent;
  let fixture: ComponentFixture<OperationResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationResultDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
