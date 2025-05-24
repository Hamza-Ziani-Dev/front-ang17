import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfilAbscenceUserComponent } from './edit-profil-abscence-user.component';

describe('EditProfilAbscenceUserComponent', () => {
  let component: EditProfilAbscenceUserComponent;
  let fixture: ComponentFixture<EditProfilAbscenceUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfilAbscenceUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProfilAbscenceUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
