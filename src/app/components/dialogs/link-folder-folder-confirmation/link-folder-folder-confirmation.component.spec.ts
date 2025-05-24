import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkFolderFolderConfirmationComponent } from './link-folder-folder-confirmation.component';

describe('LinkFolderFolderConfirmationComponent', () => {
  let component: LinkFolderFolderConfirmationComponent;
  let fixture: ComponentFixture<LinkFolderFolderConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkFolderFolderConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkFolderFolderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
