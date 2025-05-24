import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTypeCourrierDialogComponent } from './update-type-courrier-dialog.component';

describe('UpdateTypeCourrierDialogComponent', () => {
  let component: UpdateTypeCourrierDialogComponent;
  let fixture: ComponentFixture<UpdateTypeCourrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTypeCourrierDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateTypeCourrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
