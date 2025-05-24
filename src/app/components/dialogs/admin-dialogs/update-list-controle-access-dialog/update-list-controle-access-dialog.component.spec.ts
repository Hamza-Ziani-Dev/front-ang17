import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateListControleAccessDialogComponent } from './update-list-controle-access-dialog.component';

describe('UpdateListControleAccessDialogComponent', () => {
  let component: UpdateListControleAccessDialogComponent;
  let fixture: ComponentFixture<UpdateListControleAccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateListControleAccessDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateListControleAccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
