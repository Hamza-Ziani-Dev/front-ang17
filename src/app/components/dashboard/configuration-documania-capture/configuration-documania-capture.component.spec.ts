import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationDocumaniaCaptureComponent } from './configuration-documania-capture.component';

describe('ConfigurationDocumaniaCaptureComponent', () => {
  let component: ConfigurationDocumaniaCaptureComponent;
  let fixture: ComponentFixture<ConfigurationDocumaniaCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationDocumaniaCaptureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurationDocumaniaCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
