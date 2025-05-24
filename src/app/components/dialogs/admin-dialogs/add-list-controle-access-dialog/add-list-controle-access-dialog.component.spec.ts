import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListControleAccessDialogComponent } from './add-list-controle-access-dialog.component';

describe('AddListControleAccessDialogComponent', () => {
  let component: AddListControleAccessDialogComponent;
  let fixture: ComponentFixture<AddListControleAccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddListControleAccessDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddListControleAccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
