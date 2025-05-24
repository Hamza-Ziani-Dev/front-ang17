import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechButtonComponent } from './speech-button.component';

describe('SpeechButtonComponent', () => {
  let component: SpeechButtonComponent;
  let fixture: ComponentFixture<SpeechButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeechButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpeechButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
