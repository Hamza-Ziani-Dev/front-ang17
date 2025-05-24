import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilAbsComponent } from './user-profil-abs.component';

describe('UserProfilAbsComponent', () => {
  let component: UserProfilAbsComponent;
  let fixture: ComponentFixture<UserProfilAbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfilAbsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserProfilAbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
