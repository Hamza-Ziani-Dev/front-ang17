import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodebarPositioningComponent } from './codebar-positioning.component';

describe('CodebarPositioningComponent', () => {
  let component: CodebarPositioningComponent;
  let fixture: ComponentFixture<CodebarPositioningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodebarPositioningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodebarPositioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
