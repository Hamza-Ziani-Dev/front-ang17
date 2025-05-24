import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsPartagesComponent } from './documents-partages.component';

describe('DocumentsPartagesComponent', () => {
  let component: DocumentsPartagesComponent;
  let fixture: ComponentFixture<DocumentsPartagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsPartagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentsPartagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
