import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoStepDialogComponent } from './do-step-dialog.component';

describe('DoStepDialogComponent', () => {
  let component: DoStepDialogComponent;
  let fixture: ComponentFixture<DoStepDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoStepDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoStepDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
