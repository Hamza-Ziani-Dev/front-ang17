import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourrierMonEquipeComponent } from './courrier-mon-equipe.component';

describe('CourrierMonEquipeComponent', () => {
  let component: CourrierMonEquipeComponent;
  let fixture: ComponentFixture<CourrierMonEquipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourrierMonEquipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourrierMonEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
