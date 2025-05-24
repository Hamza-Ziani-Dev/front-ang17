import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterLiaisonDocumentCourrierComponent } from './ajouter-liaison-document-courrier.component';

describe('AjouterLiaisonDocumentCourrierComponent', () => {
  let component: AjouterLiaisonDocumentCourrierComponent;
  let fixture: ComponentFixture<AjouterLiaisonDocumentCourrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterLiaisonDocumentCourrierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterLiaisonDocumentCourrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
