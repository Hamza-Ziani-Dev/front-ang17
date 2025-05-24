import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQualiteDialogComponent } from './add-qualite-dialog.component';

describe('AddQualiteDialogComponent', () => {
  let component: AddQualiteDialogComponent;
  let fixture: ComponentFixture<AddQualiteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddQualiteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddQualiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
