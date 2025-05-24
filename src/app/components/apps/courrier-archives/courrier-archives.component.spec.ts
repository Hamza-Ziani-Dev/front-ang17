import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourrierArchivesComponent } from './courrier-archives.component';

describe('CourrierArchivesComponent', () => {
  let component: CourrierArchivesComponent;
  let fixture: ComponentFixture<CourrierArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourrierArchivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourrierArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
