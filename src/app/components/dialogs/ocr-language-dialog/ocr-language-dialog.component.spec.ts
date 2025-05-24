import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrLanguageDialogComponent } from './ocr-language-dialog.component';

describe('OcrLanguageDialogComponent', () => {
  let component: OcrLanguageDialogComponent;
  let fixture: ComponentFixture<OcrLanguageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcrLanguageDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OcrLanguageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
