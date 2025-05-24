import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercherDocumentComponent } from './rechercher-document.component';

describe('RechercherDocumentComponent', () => {
  let component: RechercherDocumentComponent;
  let fixture: ComponentFixture<RechercherDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercherDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RechercherDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
