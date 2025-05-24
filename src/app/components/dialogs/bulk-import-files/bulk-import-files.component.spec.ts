import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkImportFilesComponent } from './bulk-import-files.component';

describe('BulkImportFilesComponent', () => {
  let component: BulkImportFilesComponent;
  let fixture: ComponentFixture<BulkImportFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkImportFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkImportFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
