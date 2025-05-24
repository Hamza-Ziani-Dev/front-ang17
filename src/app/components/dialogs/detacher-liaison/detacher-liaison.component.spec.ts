import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetacherLiaisonComponent } from './detacher-liaison.component';

describe('DetacherLiaisonComponent', () => {
  let component: DetacherLiaisonComponent;
  let fixture: ComponentFixture<DetacherLiaisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetacherLiaisonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetacherLiaisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
