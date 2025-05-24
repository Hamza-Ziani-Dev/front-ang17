import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderSearchComponent } from './folder-search.component';

describe('FolderSearchComponent', () => {
  let component: FolderSearchComponent;
  let fixture: ComponentFixture<FolderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FolderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
