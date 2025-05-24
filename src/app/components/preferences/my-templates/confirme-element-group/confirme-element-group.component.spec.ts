import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmeElementGroupComponent } from './confirme-element-group.component';

describe('ConfirmeElementGroupComponent', () => {
  let component: ConfirmeElementGroupComponent;
  let fixture: ComponentFixture<ConfirmeElementGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmeElementGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmeElementGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
