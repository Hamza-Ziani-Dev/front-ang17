import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAttributesDialogComponent } from './update-attributes-dialog.component';

describe('UpdateAttributesDialogComponent', () => {
  let component: UpdateAttributesDialogComponent;
  let fixture: ComponentFixture<UpdateAttributesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAttributesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateAttributesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
