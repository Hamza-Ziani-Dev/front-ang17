import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendDocumentResultComponent } from './send-document-result.component';

describe('SendDocumentResultComponent', () => {
  let component: SendDocumentResultComponent;
  let fixture: ComponentFixture<SendDocumentResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendDocumentResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendDocumentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
