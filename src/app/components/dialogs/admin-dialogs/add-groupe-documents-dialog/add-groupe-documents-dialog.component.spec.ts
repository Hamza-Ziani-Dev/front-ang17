import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupeDocumentsDialogComponent } from './add-groupe-documents-dialog.component';

describe('AddGroupeDocumentsDialogComponent', () => {
  let component: AddGroupeDocumentsDialogComponent;
  let fixture: ComponentFixture<AddGroupeDocumentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupeDocumentsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGroupeDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
