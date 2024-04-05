import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignGraphicalResultAnalysisComponent } from './campaign-graphical-result-analysis.component';

describe('CampaignGraphicalResultAnalysisComponent', () => {
  let component: CampaignGraphicalResultAnalysisComponent;
  let fixture: ComponentFixture<CampaignGraphicalResultAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignGraphicalResultAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignGraphicalResultAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
