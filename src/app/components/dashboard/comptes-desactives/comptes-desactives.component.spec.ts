import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptesDesactivesComponent } from './comptes-desactives.component';

describe('ComptesDesactivesComponent', () => {
  let component: ComptesDesactivesComponent;
  let fixture: ComponentFixture<ComptesDesactivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComptesDesactivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComptesDesactivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
