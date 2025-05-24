import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneByUserHierarchyComponent } from './done-by-user-hierarchy.component';

describe('DoneByUserHierarchyComponent', () => {
  let component: DoneByUserHierarchyComponent;
  let fixture: ComponentFixture<DoneByUserHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneByUserHierarchyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoneByUserHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
