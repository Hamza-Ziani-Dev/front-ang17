import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolwsTableStatisticComponent } from './folws-table-statistic.component';

describe('FolwsTableStatisticComponent', () => {
  let component: FolwsTableStatisticComponent;
  let fixture: ComponentFixture<FolwsTableStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolwsTableStatisticComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FolwsTableStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
