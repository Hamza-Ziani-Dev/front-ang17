import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGroupeDocumentsDialogComponent } from './delete-groupe-documents-dialog.component';

describe('DeleteGroupeDocumentsDialogComponent', () => {
  let component: DeleteGroupeDocumentsDialogComponent;
  let fixture: ComponentFixture<DeleteGroupeDocumentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGroupeDocumentsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteGroupeDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
