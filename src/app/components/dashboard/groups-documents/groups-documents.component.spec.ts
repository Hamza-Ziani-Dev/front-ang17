import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsDocumentsComponent } from './groups-documents.component';

describe('GroupsDocumentsComponent', () => {
  let component: GroupsDocumentsComponent;
  let fixture: ComponentFixture<GroupsDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupsDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
