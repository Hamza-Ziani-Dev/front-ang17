import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrivilegeCourrierDialogComponent } from './add-privilege-courrier-dialog.component';

describe('AddPrivilegeCourrierDialogComponent', () => {
  let component: AddPrivilegeCourrierDialogComponent;
  let fixture: ComponentFixture<AddPrivilegeCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrivilegeCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPrivilegeCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
