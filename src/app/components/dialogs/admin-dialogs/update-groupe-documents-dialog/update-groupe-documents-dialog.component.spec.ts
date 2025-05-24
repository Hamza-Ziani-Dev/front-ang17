import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGroupeDocumentsDialogComponent } from './update-groupe-documents-dialog.component';

describe('UpdateGroupeDocumentsDialogComponent', () => {
  let component: UpdateGroupeDocumentsDialogComponent;
  let fixture: ComponentFixture<UpdateGroupeDocumentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGroupeDocumentsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateGroupeDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
