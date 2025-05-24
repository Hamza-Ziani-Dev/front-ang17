import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionDocListComponent } from './version-doc-list.component';

describe('VersionDocListComponent', () => {
  let component: VersionDocListComponent;
  let fixture: ComponentFixture<VersionDocListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionDocListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VersionDocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
