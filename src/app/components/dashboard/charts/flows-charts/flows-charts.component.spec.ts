import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowsChartsComponent } from './flows-charts.component';

describe('FlowsChartsComponent', () => {
  let component: FlowsChartsComponent;
  let fixture: ComponentFixture<FlowsChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowsChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlowsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
