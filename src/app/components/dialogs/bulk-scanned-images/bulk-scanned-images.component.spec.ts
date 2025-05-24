import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkScannedImagesComponent } from './bulk-scanned-images.component';

describe('BulkScannedImagesComponent', () => {
  let component: BulkScannedImagesComponent;
  let fixture: ComponentFixture<BulkScannedImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkScannedImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkScannedImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
