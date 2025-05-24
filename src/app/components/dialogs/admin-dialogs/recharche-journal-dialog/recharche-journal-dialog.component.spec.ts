import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecharcheJournalDialogComponent } from './recharche-journal-dialog.component';

describe('RecharcheJournalDialogComponent', () => {
  let component: RecharcheJournalDialogComponent;
  let fixture: ComponentFixture<RecharcheJournalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecharcheJournalDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecharcheJournalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
