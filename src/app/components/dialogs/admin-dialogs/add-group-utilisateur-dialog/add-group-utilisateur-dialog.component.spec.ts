import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupUtilisateurDialogComponent } from './add-group-utilisateur-dialog.component';

describe('AddGroupUtilisateurDialogComponent', () => {
  let component: AddGroupUtilisateurDialogComponent;
  let fixture: ComponentFixture<AddGroupUtilisateurDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupUtilisateurDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGroupUtilisateurDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
