import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceSignatureComponent } from './preference-signature.component';

describe('PreferenceSignatureComponent', () => {
  let component: PreferenceSignatureComponent;
  let fixture: ComponentFixture<PreferenceSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceSignatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreferenceSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
