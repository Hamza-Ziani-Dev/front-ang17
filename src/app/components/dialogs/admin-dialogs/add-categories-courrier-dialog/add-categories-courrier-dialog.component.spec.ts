import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoriesCourrierDialogComponent } from './add-categories-courrier-dialog.component';

describe('AddCategoriesCourrierDialogComponent', () => {
  let component: AddCategoriesCourrierDialogComponent;
  let fixture: ComponentFixture<AddCategoriesCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCategoriesCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCategoriesCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
