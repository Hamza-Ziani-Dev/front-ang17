import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourrierLinkDialogComponent } from './courrier-link-dialog.component';

describe('CourrierLinkDialogComponent', () => {
  let component: CourrierLinkDialogComponent;
  let fixture: ComponentFixture<CourrierLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourrierLinkDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourrierLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
