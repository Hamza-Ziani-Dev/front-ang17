import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChaineDialogComponent } from './delete-chaine-dialog.component';

describe('DeleteChaineDialogComponent', () => {
  let component: DeleteChaineDialogComponent;
  let fixture: ComponentFixture<DeleteChaineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteChaineDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteChaineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
