import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeCourrierDialogComponent } from './delete-type-courrier-dialog.component';

describe('DeleteTypeCourrierDialogComponent', () => {
  let component: DeleteTypeCourrierDialogComponent;
  let fixture: ComponentFixture<DeleteTypeCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTypeCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypeCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
