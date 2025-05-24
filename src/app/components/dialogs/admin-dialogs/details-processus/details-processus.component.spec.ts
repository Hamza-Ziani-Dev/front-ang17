import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProcessusComponent } from './details-processus.component';

describe('DetailsProcessusComponent', () => {
  let component: DetailsProcessusComponent;
  let fixture: ComponentFixture<DetailsProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsProcessusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
