import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAbsenceComponent } from './profile-absence.component';

describe('ProfileAbsenceComponent', () => {
  let component: ProfileAbsenceComponent;
  let fixture: ComponentFixture<ProfileAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAbsenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
