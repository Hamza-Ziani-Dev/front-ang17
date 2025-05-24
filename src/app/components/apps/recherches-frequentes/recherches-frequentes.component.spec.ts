import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecherchesFrequentesComponent } from './recherches-frequentes.component';

describe('RecherchesFrequentesComponent', () => {
  let component: RecherchesFrequentesComponent;
  let fixture: ComponentFixture<RecherchesFrequentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecherchesFrequentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecherchesFrequentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
