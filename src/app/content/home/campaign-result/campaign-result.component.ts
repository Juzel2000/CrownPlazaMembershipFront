import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from 'src/app/service/functional/campaign.service';
import * as XLSX from 'xlsx';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-campaign-result',
  templateUrl: './campaign-result.component.html',
  styleUrls: ['./campaign-result.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CampaignResultComponent implements OnInit {



  displayedColumns: string[] = ['firstName', 'comName', 'comCountry', 'perEmail'];
  columnsToDisplayWithExpand = ['expand', ...this.displayedColumns];
  campaignMembersList: MatTableDataSource<any>;
  isDetailRowExpanded=false;
  
  constructor(private campaignListService: CampaignService,private route: ActivatedRoute) {
    this.campaignMembersList = new MatTableDataSource<any>();
  }
  ngOnInit(): void {

    const campaignIdParam = this.route.snapshot.paramMap.get('id');
    if (campaignIdParam !== null) {
      const campaignId = parseInt(campaignIdParam, 10);

      if (!isNaN(campaignId)) {
        const campaignId = this.route.snapshot.paramMap.get('id');
      }
    this.campaignListService.getCampaignMembers(campaignId).subscribe(
      (data: any) => {
        
        this.campaignMembersList = new MatTableDataSource<any>(data);
      }
    );
    }
  }


  isExpanded(element: any): boolean {
    return element.expanded;
  }

  toggleExpanded(element: any): void {
    this.isDetailRowExpanded = this.isExpanded(element);
    if (!this.isExpanded(element)) {
      // Load data for the clicked element from API
      this.loadDetailDataFromApi(element);
    }
    
    element.expanded = !element.expanded;
  }

  loadDetailDataFromApi(element: any): void {
      this.campaignListService.getCampaignMemberdetails(element.id).subscribe(
        (data) => {
          element.detailData = data;
        }
      );
  }

  downloadExcel() {
    // Create a new workbook
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.campaignMembersList.data);

    // Create a new workbook and add the worksheet to it
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate the Excel file and save it
    XLSX.writeFile(wb, 'sample.xlsx');
  }
}
