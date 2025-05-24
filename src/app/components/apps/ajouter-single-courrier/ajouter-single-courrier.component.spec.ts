import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterSingleCourrierComponent } from './ajouter-single-courrier.component';

describe('AjouterSingleCourrierComponent', () => {
  let component: AjouterSingleCourrierComponent;
  let fixture: ComponentFixture<AjouterSingleCourrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterSingleCourrierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterSingleCourrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
