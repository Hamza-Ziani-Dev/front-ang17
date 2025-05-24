import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVolumesStockageDialogComponent } from './add-volumes-stockage-dialog.component';

describe('AddVolumesStockageDialogComponent', () => {
  let component: AddVolumesStockageDialogComponent;
  let fixture: ComponentFixture<AddVolumesStockageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVolumesStockageDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddVolumesStockageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
