import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannedImagesDialogComponent } from './scanned-images-dialog.component';

describe('ScannedImagesDialogComponent', () => {
  let component: ScannedImagesDialogComponent;
  let fixture: ComponentFixture<ScannedImagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannedImagesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScannedImagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
