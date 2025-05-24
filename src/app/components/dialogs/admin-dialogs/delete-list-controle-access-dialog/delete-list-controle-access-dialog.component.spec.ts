import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteListControleAccessDialogComponent } from './delete-list-controle-access-dialog.component';

describe('DeleteListControleAccessDialogComponent', () => {
  let component: DeleteListControleAccessDialogComponent;
  let fixture: ComponentFixture<DeleteListControleAccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteListControleAccessDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteListControleAccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
