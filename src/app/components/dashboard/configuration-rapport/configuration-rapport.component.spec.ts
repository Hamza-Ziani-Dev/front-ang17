import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationRapportComponent } from './configuration-rapport.component';

describe('ConfigurationRapportComponent', () => {
  let component: ConfigurationRapportComponent;
  let fixture: ComponentFixture<ConfigurationRapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationRapportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurationRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
