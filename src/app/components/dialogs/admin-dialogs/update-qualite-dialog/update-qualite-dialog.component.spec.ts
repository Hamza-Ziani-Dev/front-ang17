import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQualiteDialogComponent } from './update-qualite-dialog.component';

describe('UpdateQualiteDialogComponent', () => {
  let component: UpdateQualiteDialogComponent;
  let fixture: ComponentFixture<UpdateQualiteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQualiteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateQualiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
