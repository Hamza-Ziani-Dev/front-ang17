import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTemplatesComponent } from './my-templates.component';

describe('MyTemplatesComponent', () => {
  let component: MyTemplatesComponent;
  let fixture: ComponentFixture<MyTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTemplatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
