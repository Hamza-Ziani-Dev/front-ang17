import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGroupUtilisateurDialogComponent } from './delete-group-utilisateur-dialog.component';

describe('DeleteGroupUtilisateurDialogComponent', () => {
  let component: DeleteGroupUtilisateurDialogComponent;
  let fixture: ComponentFixture<DeleteGroupUtilisateurDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGroupUtilisateurDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteGroupUtilisateurDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
