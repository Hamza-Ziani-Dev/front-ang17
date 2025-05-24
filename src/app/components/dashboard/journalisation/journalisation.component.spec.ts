import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalisationComponent } from './journalisation.component';

describe('JournalisationComponent', () => {
  let component: JournalisationComponent;
  let fixture: ComponentFixture<JournalisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JournalisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
