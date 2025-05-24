import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDestinatairesComponent } from './delete-destinataires.component';

describe('DeleteDestinatairesComponent', () => {
  let component: DeleteDestinatairesComponent;
  let fixture: ComponentFixture<DeleteDestinatairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDestinatairesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteDestinatairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
