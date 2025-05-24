import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultCourrierComponent } from './result-courrier.component';

describe('ResultCourrierComponent', () => {
  let component: ResultCourrierComponent;
  let fixture: ComponentFixture<ResultCourrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultCourrierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultCourrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
