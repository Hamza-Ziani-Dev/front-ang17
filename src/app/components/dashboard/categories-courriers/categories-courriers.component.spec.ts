import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesCourriersComponent } from './categories-courriers.component';

describe('CategoriesCourriersComponent', () => {
  let component: CategoriesCourriersComponent;
  let fixture: ComponentFixture<CategoriesCourriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesCourriersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriesCourriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
