import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnciennesProcessusVersionsComponent } from './anciennes-processus-versions.component';

describe('AnciennesProcessusVersionsComponent', () => {
  let component: AnciennesProcessusVersionsComponent;
  let fixture: ComponentFixture<AnciennesProcessusVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnciennesProcessusVersionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnciennesProcessusVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
