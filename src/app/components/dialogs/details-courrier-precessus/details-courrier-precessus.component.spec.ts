import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCourrierPrecessusComponent } from './details-courrier-precessus.component';

describe('DetailsCourrierPrecessusComponent', () => {
  let component: DetailsCourrierPrecessusComponent;
  let fixture: ComponentFixture<DetailsCourrierPrecessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCourrierPrecessusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsCourrierPrecessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
