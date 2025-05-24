import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesDocumentsComponent } from './types-documents.component';

describe('TypesDocumentsComponent', () => {
  let component: TypesDocumentsComponent;
  let fixture: ComponentFixture<TypesDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypesDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
