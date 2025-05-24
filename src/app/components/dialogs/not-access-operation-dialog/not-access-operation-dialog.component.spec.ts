import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAccessOperationDialogComponent } from './not-access-operation-dialog.component';

describe('NotAccessOperationDialogComponent', () => {
  let component: NotAccessOperationDialogComponent;
  let fixture: ComponentFixture<NotAccessOperationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotAccessOperationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotAccessOperationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
