import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningInfoComponent } from './warning-info.component';

describe('WarningInfoComponent', () => {
  let component: WarningInfoComponent;
  let fixture: ComponentFixture<WarningInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarningInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarningInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
