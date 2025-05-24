import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDestinatairesComponent } from './add-destinataires.component';

describe('AddDestinatairesComponent', () => {
  let component: AddDestinatairesComponent;
  let fixture: ComponentFixture<AddDestinatairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDestinatairesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDestinatairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
