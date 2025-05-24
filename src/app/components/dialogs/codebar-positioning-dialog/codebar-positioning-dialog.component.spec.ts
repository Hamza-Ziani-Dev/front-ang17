import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodebarPositioningDialogComponent } from './codebar-positioning-dialog.component';

describe('CodebarPositioningDialogComponent', () => {
  let component: CodebarPositioningDialogComponent;
  let fixture: ComponentFixture<CodebarPositioningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodebarPositioningDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodebarPositioningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
