import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignResultComponent } from './campaign-result.component';

describe('CampaignResultComponent', () => {
  let component: CampaignResultComponent;
  let fixture: ComponentFixture<CampaignResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
