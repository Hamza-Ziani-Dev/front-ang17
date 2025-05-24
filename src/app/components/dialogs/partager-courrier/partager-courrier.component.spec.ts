import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartagerCourrierComponent } from './partager-courrier.component';

describe('PartagerCourrierComponent', () => {
  let component: PartagerCourrierComponent;
  let fixture: ComponentFixture<PartagerCourrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartagerCourrierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartagerCourrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
