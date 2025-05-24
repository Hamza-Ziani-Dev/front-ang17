import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultFoundedComponent } from './no-result-founded.component';

describe('NoResultFoundedComponent', () => {
  let component: NoResultFoundedComponent;
  let fixture: ComponentFixture<NoResultFoundedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoResultFoundedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoResultFoundedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
