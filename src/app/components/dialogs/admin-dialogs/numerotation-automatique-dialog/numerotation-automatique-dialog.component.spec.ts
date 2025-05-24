import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumerotationAutomatiqueDialogComponent } from './numerotation-automatique-dialog.component';

describe('NumerotationAutomatiqueDialogComponent', () => {
  let component: NumerotationAutomatiqueDialogComponent;
  let fixture: ComponentFixture<NumerotationAutomatiqueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumerotationAutomatiqueDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumerotationAutomatiqueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
