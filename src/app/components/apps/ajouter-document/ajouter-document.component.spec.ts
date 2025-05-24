import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterDocumentComponent } from './ajouter-document.component';

describe('AjouterDocumentComponent', () => {
  let component: AjouterDocumentComponent;
  let fixture: ComponentFixture<AjouterDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
