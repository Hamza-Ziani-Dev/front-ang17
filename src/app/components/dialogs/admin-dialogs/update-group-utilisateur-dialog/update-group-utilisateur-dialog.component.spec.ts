import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGroupUtilisateurDialogComponent } from './update-group-utilisateur-dialog.component';

describe('UpdateGroupUtilisateurDialogComponent', () => {
  let component: UpdateGroupUtilisateurDialogComponent;
  let fixture: ComponentFixture<UpdateGroupUtilisateurDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGroupUtilisateurDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateGroupUtilisateurDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
