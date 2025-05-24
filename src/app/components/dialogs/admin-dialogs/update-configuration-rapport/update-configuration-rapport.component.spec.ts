import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConfigurationRapportComponent } from './update-configuration-rapport.component';

describe('UpdateConfigurationRapportComponent', () => {
  let component: UpdateConfigurationRapportComponent;
  let fixture: ComponentFixture<UpdateConfigurationRapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateConfigurationRapportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateConfigurationRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
