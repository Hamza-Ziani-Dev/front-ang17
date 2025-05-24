import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProcessusComponent } from './update-processus.component';

describe('UpdateProcessusComponent', () => {
  let component: UpdateProcessusComponent;
  let fixture: ComponentFixture<UpdateProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProcessusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
