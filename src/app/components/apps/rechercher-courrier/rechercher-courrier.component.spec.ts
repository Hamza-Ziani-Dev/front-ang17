import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercherCourrierComponent } from './rechercher-courrier.component';

describe('RechercherCourrierComponent', () => {
  let component: RechercherCourrierComponent;
  let fixture: ComponentFixture<RechercherCourrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercherCourrierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RechercherCourrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
