import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateEtapeComponent } from './validate-etape.component';

describe('ValidateEtapeComponent', () => {
  let component: ValidateEtapeComponent;
  let fixture: ComponentFixture<ValidateEtapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateEtapeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidateEtapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
