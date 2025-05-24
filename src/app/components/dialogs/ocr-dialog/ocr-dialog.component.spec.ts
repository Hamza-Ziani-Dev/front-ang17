import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrDialogComponent } from './ocr-dialog.component';

describe('OcrDialogComponent', () => {
  let component: OcrDialogComponent;
  let fixture: ComponentFixture<OcrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcrDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OcrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
