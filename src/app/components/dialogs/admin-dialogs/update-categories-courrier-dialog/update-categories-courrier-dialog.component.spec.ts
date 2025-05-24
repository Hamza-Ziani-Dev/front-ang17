import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCategoriesCourrierDialogComponent } from './update-categories-courrier-dialog.component';

describe('UpdateCategoriesCourrierDialogComponent', () => {
  let component: UpdateCategoriesCourrierDialogComponent;
  let fixture: ComponentFixture<UpdateCategoriesCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCategoriesCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateCategoriesCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
