import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteQualiteDialogComponent } from './delete-qualite-dialog.component';

describe('DeleteQualiteDialogComponent', () => {
  let component: DeleteQualiteDialogComponent;
  let fixture: ComponentFixture<DeleteQualiteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteQualiteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteQualiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
