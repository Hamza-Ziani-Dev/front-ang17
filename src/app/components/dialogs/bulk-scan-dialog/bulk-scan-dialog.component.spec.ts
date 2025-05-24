import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkScanDialogComponent } from './bulk-scan-dialog.component';

describe('BulkScanDialogComponent', () => {
  let component: BulkScanDialogComponent;
  let fixture: ComponentFixture<BulkScanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkScanDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkScanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
