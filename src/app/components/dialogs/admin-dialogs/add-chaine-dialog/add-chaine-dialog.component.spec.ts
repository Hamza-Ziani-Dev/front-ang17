import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChaineDialogComponent } from './add-chaine-dialog.component';

describe('AddChaineDialogComponent', () => {
  let component: AddChaineDialogComponent;
  let fixture: ComponentFixture<AddChaineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChaineDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddChaineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
