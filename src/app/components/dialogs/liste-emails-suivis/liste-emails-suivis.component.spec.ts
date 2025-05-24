import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEmailsSuivisComponent } from './liste-emails-suivis.component';

describe('ListeEmailsSuivisComponent', () => {
  let component: ListeEmailsSuivisComponent;
  let fixture: ComponentFixture<ListeEmailsSuivisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeEmailsSuivisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeEmailsSuivisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
