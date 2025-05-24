import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesCourriersComponent } from './types-courriers.component';

describe('TypesCourriersComponent', () => {
  let component: TypesCourriersComponent;
  let fixture: ComponentFixture<TypesCourriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesCourriersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypesCourriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
