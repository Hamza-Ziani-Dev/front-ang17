import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCategoriesCourrierDialogComponent } from './delete-categories-courrier-dialog.component';

describe('DeleteCategoriesCourrierDialogComponent', () => {
  let component: DeleteCategoriesCourrierDialogComponent;
  let fixture: ComponentFixture<DeleteCategoriesCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCategoriesCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCategoriesCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
