import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmetteursComponent } from './add-emetteurs.component';

describe('AddEmetteursComponent', () => {
  let component: AddEmetteursComponent;
  let fixture: ComponentFixture<AddEmetteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmetteursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEmetteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
