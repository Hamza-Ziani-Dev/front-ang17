import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributsRequisDialogComponent } from './attributs-requis-dialog.component';

describe('AttributsRequisDialogComponent', () => {
  let component: AttributsRequisDialogComponent;
  let fixture: ComponentFixture<AttributsRequisDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributsRequisDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttributsRequisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
