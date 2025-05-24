import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbondonneModalComponent } from './abondonne-modal.component';

describe('AbondonneModalComponent', () => {
  let component: AbondonneModalComponent;
  let fixture: ComponentFixture<AbondonneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbondonneModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbondonneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
