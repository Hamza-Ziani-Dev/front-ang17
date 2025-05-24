import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChaineDialogComponent } from './update-chaine-dialog.component';

describe('UpdateChaineDialogComponent', () => {
  let component: UpdateChaineDialogComponent;
  let fixture: ComponentFixture<UpdateChaineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateChaineDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateChaineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
