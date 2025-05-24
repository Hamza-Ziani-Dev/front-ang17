import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePrivilegeDocumentDialogComponent } from './delete-privilege-document-dialog.component';

describe('DeletePrivilegeDocumentDialogComponent', () => {
  let component: DeletePrivilegeDocumentDialogComponent;
  let fixture: ComponentFixture<DeletePrivilegeDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePrivilegeDocumentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePrivilegeDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
