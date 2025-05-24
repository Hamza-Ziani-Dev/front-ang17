import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxElectroniqueComponent } from './flux-electronique.component';

describe('FluxElectroniqueComponent', () => {
  let component: FluxElectroniqueComponent;
  let fixture: ComponentFixture<FluxElectroniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluxElectroniqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FluxElectroniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
