import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBulkDocumentComponent } from './ajouter-bulk-document.component';

describe('AjouterBulkDocumentComponent', () => {
  let component: AjouterBulkDocumentComponent;
  let fixture: ComponentFixture<AjouterBulkDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterBulkDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterBulkDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
