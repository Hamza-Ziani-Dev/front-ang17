import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumesStockageComponent } from './volumes-stockage.component';

describe('VolumesStockageComponent', () => {
  let component: VolumesStockageComponent;
  let fixture: ComponentFixture<VolumesStockageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolumesStockageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolumesStockageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
