import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBordereauComponent } from './generate-bordereau.component';

describe('GenerateBordereauComponent', () => {
  let component: GenerateBordereauComponent;
  let fixture: ComponentFixture<GenerateBordereauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateBordereauComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateBordereauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
