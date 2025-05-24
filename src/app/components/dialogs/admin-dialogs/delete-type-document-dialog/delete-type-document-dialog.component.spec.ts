import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeDocumentDialogComponent } from './delete-type-document-dialog.component';

describe('DeleteTypeDocumentDialogComponent', () => {
  let component: DeleteTypeDocumentDialogComponent;
  let fixture: ComponentFixture<DeleteTypeDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTypeDocumentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypeDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
