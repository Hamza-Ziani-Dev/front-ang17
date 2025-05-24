import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveModelDialogComponent } from './save-model-dialog.component';

describe('SaveModelDialogComponent', () => {
  let component: SaveModelDialogComponent;
  let fixture: ComponentFixture<SaveModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveModelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
