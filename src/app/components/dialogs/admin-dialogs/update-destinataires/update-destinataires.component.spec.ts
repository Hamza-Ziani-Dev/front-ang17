import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDestinatairesComponent } from './update-destinataires.component';

describe('UpdateDestinatairesComponent', () => {
  let component: UpdateDestinatairesComponent;
  let fixture: ComponentFixture<UpdateDestinatairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDestinatairesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDestinatairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
