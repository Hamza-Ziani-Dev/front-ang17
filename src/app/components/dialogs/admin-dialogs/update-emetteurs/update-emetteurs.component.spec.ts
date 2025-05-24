import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmetteursComponent } from './update-emetteurs.component';

describe('UpdateEmetteursComponent', () => {
  let component: UpdateEmetteursComponent;
  let fixture: ComponentFixture<UpdateEmetteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmetteursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateEmetteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
