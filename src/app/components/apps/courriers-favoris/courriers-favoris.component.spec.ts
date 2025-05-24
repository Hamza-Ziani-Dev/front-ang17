import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourriersFavorisComponent } from './courriers-favoris.component';

describe('CourriersFavorisComponent', () => {
  let component: CourriersFavorisComponent;
  let fixture: ComponentFixture<CourriersFavorisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourriersFavorisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourriersFavorisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
