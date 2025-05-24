import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePrivilegeDocumentDialogComponent } from './update-privilege-document-dialog.component';

describe('UpdatePrivilegeDocumentDialogComponent', () => {
  let component: UpdatePrivilegeDocumentDialogComponent;
  let fixture: ComponentFixture<UpdatePrivilegeDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePrivilegeDocumentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatePrivilegeDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
