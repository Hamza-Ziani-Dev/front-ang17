import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSearchComponent } from './save-search.component';

describe('SaveSearchComponent', () => {
  let component: SaveSearchComponent;
  let fixture: ComponentFixture<SaveSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
