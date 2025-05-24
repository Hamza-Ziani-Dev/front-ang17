import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePrivilegeCourrierDialogComponent } from './delete-privilege-courrier-dialog.component';

describe('DeletePrivilegeCourrierDialogComponent', () => {
  let component: DeletePrivilegeCourrierDialogComponent;
  let fixture: ComponentFixture<DeletePrivilegeCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePrivilegeCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePrivilegeCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
