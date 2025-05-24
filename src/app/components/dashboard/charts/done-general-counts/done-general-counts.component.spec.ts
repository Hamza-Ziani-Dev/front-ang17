import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneGeneralCountsComponent } from './done-general-counts.component';

describe('DoneGeneralCountsComponent', () => {
  let component: DoneGeneralCountsComponent;
  let fixture: ComponentFixture<DoneGeneralCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneGeneralCountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoneGeneralCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
