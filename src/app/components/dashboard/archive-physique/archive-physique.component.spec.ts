import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivePhysiqueComponent } from './archive-physique.component';

describe('ArchivePhysiqueComponent', () => {
  let component: ArchivePhysiqueComponent;
  let fixture: ComponentFixture<ArchivePhysiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivePhysiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivePhysiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
