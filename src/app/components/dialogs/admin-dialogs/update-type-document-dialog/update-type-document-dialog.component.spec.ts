import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTypeDocumentDialogComponent } from './update-type-document-dialog.component';

describe('UpdateTypeDocumentDialogComponent', () => {
  let component: UpdateTypeDocumentDialogComponent;
  let fixture: ComponentFixture<UpdateTypeDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTypeDocumentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateTypeDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
