import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentPopupComponent } from './add-document-popup.component';

describe('AddDocumentPopupComponent', () => {
  let component: AddDocumentPopupComponent;
  let fixture: ComponentFixture<AddDocumentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDocumentPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDocumentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
