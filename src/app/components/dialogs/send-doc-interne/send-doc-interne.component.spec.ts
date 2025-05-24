import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendDocInterneComponent } from './send-doc-interne.component';

describe('SendDocInterneComponent', () => {
  let component: SendDocInterneComponent;
  let fixture: ComponentFixture<SendDocInterneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendDocInterneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendDocInterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
