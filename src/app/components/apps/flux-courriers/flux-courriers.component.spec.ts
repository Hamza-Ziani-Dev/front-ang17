import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxCourriersComponent } from './flux-courriers.component';

describe('FluxCourriersComponent', () => {
  let component: FluxCourriersComponent;
  let fixture: ComponentFixture<FluxCourriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluxCourriersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FluxCourriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
