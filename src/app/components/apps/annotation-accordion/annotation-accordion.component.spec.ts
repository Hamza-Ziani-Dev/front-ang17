import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationAccordionComponent } from './annotation-accordion.component';

describe('AnnotationAccordionComponent', () => {
  let component: AnnotationAccordionComponent;
  let fixture: ComponentFixture<AnnotationAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationAccordionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnotationAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
