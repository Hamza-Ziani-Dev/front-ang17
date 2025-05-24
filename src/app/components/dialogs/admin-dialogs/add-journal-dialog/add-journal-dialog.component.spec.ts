import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJournalDialogComponent } from './add-journal-dialog.component';

describe('AddJournalDialogComponent', () => {
  let component: AddJournalDialogComponent;
  let fixture: ComponentFixture<AddJournalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddJournalDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddJournalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
