import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceSearchComponent } from './voice-search.component';

describe('VoiceSearchComponent', () => {
  let component: VoiceSearchComponent;
  let fixture: ComponentFixture<VoiceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoiceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
