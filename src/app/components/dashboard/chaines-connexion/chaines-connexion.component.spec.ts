import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainesConnexionComponent } from './chaines-connexion.component';

describe('ChainesConnexionComponent', () => {
  let component: ChainesConnexionComponent;
  let fixture: ComponentFixture<ChainesConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChainesConnexionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChainesConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
