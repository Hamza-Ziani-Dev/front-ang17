import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfilAbscenceUserComponent } from './add-profil-abscence-user.component';

describe('AddProfilAbscenceUserComponent', () => {
  let component: AddProfilAbscenceUserComponent;
  let fixture: ComponentFixture<AddProfilAbscenceUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProfilAbscenceUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProfilAbscenceUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
