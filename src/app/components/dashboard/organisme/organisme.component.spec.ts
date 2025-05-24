import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismeComponent } from './organisme.component';

describe('OrganismeComponent', () => {
  let component: OrganismeComponent;
  let fixture: ComponentFixture<OrganismeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganismeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganismeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
