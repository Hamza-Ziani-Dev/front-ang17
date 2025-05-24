import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttributesDialogComponent } from './add-attributes-dialog.component';

describe('AddAttributesDialogComponent', () => {
  let component: AddAttributesDialogComponent;
  let fixture: ComponentFixture<AddAttributesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttributesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAttributesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
