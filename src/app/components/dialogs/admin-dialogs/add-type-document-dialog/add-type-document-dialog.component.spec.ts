import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeDocumentDialogComponent } from './add-type-document-dialog.component';

describe('AddTypeDocumentDialogComponent', () => {
  let component: AddTypeDocumentDialogComponent;
  let fixture: ComponentFixture<AddTypeDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTypeDocumentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTypeDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
