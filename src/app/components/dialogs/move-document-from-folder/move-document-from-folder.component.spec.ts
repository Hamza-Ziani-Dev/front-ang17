import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveDocumentFromFolderComponent } from './move-document-from-folder.component';

describe('MoveDocumentFromFolderComponent', () => {
  let component: MoveDocumentFromFolderComponent;
  let fixture: ComponentFixture<MoveDocumentFromFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveDocumentFromFolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveDocumentFromFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
