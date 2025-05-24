import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeCourrierDialogComponent } from './add-type-courrier-dialog.component';

describe('AddTypeCourrierDialogComponent', () => {
  let component: AddTypeCourrierDialogComponent;
  let fixture: ComponentFixture<AddTypeCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTypeCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTypeCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
