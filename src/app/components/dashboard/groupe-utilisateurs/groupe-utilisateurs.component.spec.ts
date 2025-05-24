import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupeUtilisateursComponent } from './groupe-utilisateurs.component';

describe('GroupeUtilisateursComponent', () => {
  let component: GroupeUtilisateursComponent;
  let fixture: ComponentFixture<GroupeUtilisateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupeUtilisateursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupeUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
