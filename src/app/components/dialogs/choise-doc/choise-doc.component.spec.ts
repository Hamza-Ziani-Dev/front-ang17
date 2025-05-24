import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiseDocComponent } from './choise-doc.component';

describe('ChoiseDocComponent', () => {
  let component: ChoiseDocComponent;
  let fixture: ComponentFixture<ChoiseDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiseDocComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoiseDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
