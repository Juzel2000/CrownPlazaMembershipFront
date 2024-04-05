import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMatchedMembersComponent } from './campaign-matched-members.component';

describe('CampaignMatchedMembersComponent', () => {
  let component: CampaignMatchedMembersComponent;
  let fixture: ComponentFixture<CampaignMatchedMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignMatchedMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMatchedMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
