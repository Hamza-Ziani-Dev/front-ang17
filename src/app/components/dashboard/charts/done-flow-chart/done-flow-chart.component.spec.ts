import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneFlowChartComponent } from './done-flow-chart.component';

describe('DoneFlowChartComponent', () => {
  let component: DoneFlowChartComponent;
  let fixture: ComponentFixture<DoneFlowChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneFlowChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoneFlowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
