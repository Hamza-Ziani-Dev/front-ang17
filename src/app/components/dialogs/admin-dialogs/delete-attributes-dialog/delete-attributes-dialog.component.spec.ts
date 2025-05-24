import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAttributesDialogComponent } from './delete-attributes-dialog.component';

describe('DeleteAttributesDialogComponent', () => {
  let component: DeleteAttributesDialogComponent;
  let fixture: ComponentFixture<DeleteAttributesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAttributesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteAttributesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
