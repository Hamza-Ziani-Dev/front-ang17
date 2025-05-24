import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourriesPartagesComponent } from './courries-partages.component';

describe('CourriesPartagesComponent', () => {
  let component: CourriesPartagesComponent;
  let fixture: ComponentFixture<CourriesPartagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourriesPartagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourriesPartagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
