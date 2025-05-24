import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBulkCourrierComponent } from './ajouter-bulk-courrier.component';

describe('AjouterBulkCourrierComponent', () => {
  let component: AjouterBulkCourrierComponent;
  let fixture: ComponentFixture<AjouterBulkCourrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterBulkCourrierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterBulkCourrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
