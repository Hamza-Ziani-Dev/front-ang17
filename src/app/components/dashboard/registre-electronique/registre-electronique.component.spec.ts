import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistreElectroniqueComponent } from './registre-electronique.component';

describe('RegistreElectroniqueComponent', () => {
  let component: RegistreElectroniqueComponent;
  let fixture: ComponentFixture<RegistreElectroniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistreElectroniqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistreElectroniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
