import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendDocumentComponent } from './send-document.component';

describe('SendDocumentComponent', () => {
  let component: SendDocumentComponent;
  let fixture: ComponentFixture<SendDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
