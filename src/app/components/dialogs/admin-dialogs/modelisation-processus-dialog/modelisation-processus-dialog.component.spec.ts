import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelisationProcessusDialogComponent } from './modelisation-processus-dialog.component';

describe('ModelisationProcessusDialogComponent', () => {
  let component: ModelisationProcessusDialogComponent;
  let fixture: ComponentFixture<ModelisationProcessusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelisationProcessusDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelisationProcessusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
