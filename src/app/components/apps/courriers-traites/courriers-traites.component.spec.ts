import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourriersTraitesComponent } from './courriers-traites.component';

describe('CourriersTraitesComponent', () => {
  let component: CourriersTraitesComponent;
  let fixture: ComponentFixture<CourriersTraitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourriersTraitesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourriersTraitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
