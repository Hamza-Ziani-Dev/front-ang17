import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderToFoldersComponent } from './folder-to-folders.component';

describe('FolderToFoldersComponent', () => {
  let component: FolderToFoldersComponent;
  let fixture: ComponentFixture<FolderToFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderToFoldersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FolderToFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
