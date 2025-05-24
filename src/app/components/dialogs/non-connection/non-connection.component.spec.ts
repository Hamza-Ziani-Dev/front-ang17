import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConnectionComponent } from './non-connection.component';

describe('NonConnectionComponent', () => {
  let component: NonConnectionComponent;
  let fixture: ComponentFixture<NonConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonConnectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NonConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
