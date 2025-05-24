import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionMotifDialogComponent } from './instruction-motif-dialog.component';

describe('InstructionMotifDialogComponent', () => {
  let component: InstructionMotifDialogComponent;
  let fixture: ComponentFixture<InstructionMotifDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionMotifDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructionMotifDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
