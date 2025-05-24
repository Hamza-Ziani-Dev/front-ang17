import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveModelComponent } from './save-model.component';

describe('SaveModelComponent', () => {
  let component: SaveModelComponent;
  let fixture: ComponentFixture<SaveModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
