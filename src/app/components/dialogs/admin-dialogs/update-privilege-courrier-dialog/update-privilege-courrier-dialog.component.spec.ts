import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePrivilegeCourrierDialogComponent } from './update-privilege-courrier-dialog.component';

describe('UpdatePrivilegeCourrierDialogComponent', () => {
  let component: UpdatePrivilegeCourrierDialogComponent;
  let fixture: ComponentFixture<UpdatePrivilegeCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePrivilegeCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatePrivilegeCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
