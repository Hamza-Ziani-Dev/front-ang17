import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultEditCourrierDialogComponent } from './result-edit-courrier-dialog.component';

describe('ResultEditCourrierDialogComponent', () => {
  let component: ResultEditCourrierDialogComponent;
  let fixture: ComponentFixture<ResultEditCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultEditCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultEditCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
