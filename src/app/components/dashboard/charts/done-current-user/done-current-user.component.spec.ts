import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneCurrentUserComponent } from './done-current-user.component';

describe('DoneCurrentUserComponent', () => {
  let component: DoneCurrentUserComponent;
  let fixture: ComponentFixture<DoneCurrentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneCurrentUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoneCurrentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
