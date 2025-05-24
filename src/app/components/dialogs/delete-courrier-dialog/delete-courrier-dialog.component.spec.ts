import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCourrierDialogComponent } from './delete-courrier-dialog.component';

describe('DeleteCourrierDialogComponent', () => {
  let component: DeleteCourrierDialogComponent;
  let fixture: ComponentFixture<DeleteCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
