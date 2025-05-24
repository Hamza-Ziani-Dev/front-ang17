import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InprogressredComponent } from './inprogressred.component';

describe('InprogressredComponent', () => {
  let component: InprogressredComponent;
  let fixture: ComponentFixture<InprogressredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InprogressredComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InprogressredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
