import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualitesComponent } from './qualites.component';

describe('QualitesComponent', () => {
  let component: QualitesComponent;
  let fixture: ComponentFixture<QualitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualitesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
