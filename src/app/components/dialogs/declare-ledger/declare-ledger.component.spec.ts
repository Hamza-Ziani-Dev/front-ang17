import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclareLedgerComponent } from './declare-ledger.component';

describe('DeclareLedgerComponent', () => {
  let component: DeclareLedgerComponent;
  let fixture: ComponentFixture<DeclareLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclareLedgerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeclareLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
