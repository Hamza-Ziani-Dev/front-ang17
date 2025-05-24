import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadModelDialogComponent } from './load-model-dialog.component';

describe('LoadModelDialogComponent', () => {
  let component: LoadModelDialogComponent;
  let fixture: ComponentFixture<LoadModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadModelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
