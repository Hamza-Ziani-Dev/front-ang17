import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleAdminComponent } from './console-admin.component';

describe('ConsoleAdminComponent', () => {
  let component: ConsoleAdminComponent;
  let fixture: ComponentFixture<ConsoleAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsoleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
