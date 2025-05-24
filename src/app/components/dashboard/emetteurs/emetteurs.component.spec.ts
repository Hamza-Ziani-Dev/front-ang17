import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmetteursComponent } from './emetteurs.component';

describe('EmetteursComponent', () => {
  let component: EmetteursComponent;
  let fixture: ComponentFixture<EmetteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmetteursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmetteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
