import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCourrierRecentComponent } from './update-courrier-recent.component';

describe('UpdateCourrierRecentComponent', () => {
  let component: UpdateCourrierRecentComponent;
  let fixture: ComponentFixture<UpdateCourrierRecentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCourrierRecentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateCourrierRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
