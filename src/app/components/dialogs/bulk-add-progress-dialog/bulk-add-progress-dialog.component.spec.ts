import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAddProgressDialogComponent } from './bulk-add-progress-dialog.component';

describe('BulkAddProgressDialogComponent', () => {
  let component: BulkAddProgressDialogComponent;
  let fixture: ComponentFixture<BulkAddProgressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkAddProgressDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkAddProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
