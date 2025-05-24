import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTextDialogComponent } from './editor-text-dialog.component';

describe('EditorTextDialogComponent', () => {
  let component: EditorTextDialogComponent;
  let fixture: ComponentFixture<EditorTextDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorTextDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
