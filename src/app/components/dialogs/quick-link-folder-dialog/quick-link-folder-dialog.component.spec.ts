import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickLinkFolderDialogComponent } from './quick-link-folder-dialog.component';

describe('QuickLinkFolderDialogComponent', () => {
  let component: QuickLinkFolderDialogComponent;
  let fixture: ComponentFixture<QuickLinkFolderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickLinkFolderDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickLinkFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
