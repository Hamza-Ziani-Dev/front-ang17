import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TexteditorComponentComponent } from './texteditor-component.component';

describe('TexteditorComponentComponent', () => {
  let component: TexteditorComponentComponent;
  let fixture: ComponentFixture<TexteditorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TexteditorComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TexteditorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
