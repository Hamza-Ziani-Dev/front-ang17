import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkImportDialogComponent } from './bulk-import-dialog.component';

describe('BulkImportDialogComponent', () => {
  let component: BulkImportDialogComponent;
  let fixture: ComponentFixture<BulkImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkImportDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
