import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterLiaisonCourrierCourrierComponent } from './ajouter-liaison-courrier-courrier.component';

describe('AjouterLiaisonCourrierCourrierComponent', () => {
  let component: AjouterLiaisonCourrierCourrierComponent;
  let fixture: ComponentFixture<AjouterLiaisonCourrierCourrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterLiaisonCourrierCourrierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterLiaisonCourrierCourrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
