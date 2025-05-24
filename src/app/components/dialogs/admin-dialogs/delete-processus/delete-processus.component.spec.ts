import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProcessusComponent } from './delete-processus.component';

describe('DeleteProcessusComponent', () => {
  let component: DeleteProcessusComponent;
  let fixture: ComponentFixture<DeleteProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProcessusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
