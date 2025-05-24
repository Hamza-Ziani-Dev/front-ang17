import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrivilegeDocumentDialogComponent } from './add-privilege-document-dialog.component';

describe('AddPrivilegeDocumentDialogComponent', () => {
  let component: AddPrivilegeDocumentDialogComponent;
  let fixture: ComponentFixture<AddPrivilegeDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrivilegeDocumentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPrivilegeDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
