import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcessusComponent } from './add-processus.component';

describe('AddProcessusComponent', () => {
  let component: AddProcessusComponent;
  let fixture: ComponentFixture<AddProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProcessusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
