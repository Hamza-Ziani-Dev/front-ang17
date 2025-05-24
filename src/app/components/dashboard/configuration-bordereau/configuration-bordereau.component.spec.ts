import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationBordereauComponent } from './configuration-bordereau.component';

describe('ConfigurationBordereauComponent', () => {
  let component: ConfigurationBordereauComponent;
  let fixture: ComponentFixture<ConfigurationBordereauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationBordereauComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurationBordereauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
