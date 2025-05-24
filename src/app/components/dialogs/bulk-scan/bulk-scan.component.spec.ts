import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkScanComponent } from './bulk-scan.component';

describe('BulkScanComponent', () => {
  let component: BulkScanComponent;
  let fixture: ComponentFixture<BulkScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkScanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
