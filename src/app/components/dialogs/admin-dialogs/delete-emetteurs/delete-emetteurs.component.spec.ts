import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEmetteursComponent } from './delete-emetteurs.component';

describe('DeleteEmetteursComponent', () => {
  let component: DeleteEmetteursComponent;
  let fixture: ComponentFixture<DeleteEmetteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEmetteursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteEmetteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
