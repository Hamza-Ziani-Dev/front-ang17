import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackDetailsComponent } from './back-details.component';

describe('BackDetailsComponent', () => {
  let component: BackDetailsComponent;
  let fixture: ComponentFixture<BackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
