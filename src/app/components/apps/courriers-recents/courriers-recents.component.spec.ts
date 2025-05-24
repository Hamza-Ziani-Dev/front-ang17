import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourriersRecentsComponent } from './courriers-recents.component';

describe('CourriersRecentsComponent', () => {
  let component: CourriersRecentsComponent;
  let fixture: ComponentFixture<CourriersRecentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourriersRecentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourriersRecentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
