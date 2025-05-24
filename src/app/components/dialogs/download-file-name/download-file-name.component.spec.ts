import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFileNameComponent } from './download-file-name.component';

describe('DownloadFileNameComponent', () => {
  let component: DownloadFileNameComponent;
  let fixture: ComponentFixture<DownloadFileNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadFileNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownloadFileNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
