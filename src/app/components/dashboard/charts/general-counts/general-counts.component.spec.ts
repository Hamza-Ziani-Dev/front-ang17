import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCountsComponent } from './general-counts.component';

describe('GeneralCountsComponent', () => {
  let component: GeneralCountsComponent;
  let fixture: ComponentFixture<GeneralCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralCountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
