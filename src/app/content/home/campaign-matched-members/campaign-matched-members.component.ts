import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { CampaignService } from 'src/app/service/functional/campaign.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-campaign-matched-members',
  templateUrl: './campaign-matched-members.component.html',
  styleUrls: ['./campaign-matched-members.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CampaignMatchedMembersComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'comName', 'comCountry', 'perEmail','personRole','companyJobType'];
  columnsToDisplayWithExpand = ['expand', ...this.displayedColumns];
  campaignMembersList: MatTableDataSource<any>;
  originalCampaignMembersList: MatTableDataSource<any>;
  isDetailRowExpanded=false;
  campaignName: string | null = null;
  isLoading = false;
  
    pageSizeOptions: number[] = [5, 10, 25, 100];
    pageSize = 20; // Initial page size
    pageIndex = 0; // Initial page index
    length=500

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selectedFilter!: string ;
    searchTerm!: string ;

    campaignId !: number ;
    selectedEmailFilter ="EmailsIncluded" ;

  constructor(private campaignListService: CampaignService,private route: ActivatedRoute,private dialog: MatDialog) {
    this.campaignMembersList = new MatTableDataSource<any>();
    this.originalCampaignMembersList = new MatTableDataSource<any>(); 
  }

  ngOnInit(): void {

    this.isLoading = true;
    const campaignIdParam = this.route.snapshot.paramMap.get('id');

    if (campaignIdParam !== null) {
      const campaignId = parseInt(campaignIdParam, 10);
      this.campaignId = campaignId;

      if (!isNaN(campaignId)) {
        const campaignId = this.route.snapshot.paramMap.get('id');
      }
      
     this.campaignListService.getCampaignMembers(campaignId).subscribe(
      (data: any) => {
        
        let popUpMsg='';
        if(data.status.trim()=='Waiting'){

           popUpMsg= 'The campaign result is generating.Please wait.....';
        }

        else if(data.status.trim()=='GeneratedButNoResult'){
           popUpMsg= 'No members exist for this campaign.';
        }
        else if(data.status.trim()=='NotGenerated'){
           popUpMsg= 'The campaign result is not generated.Please generate it on edit campaign.';
          
        }

        if(data.status.trim()=='NotGenerated' || data.status.trim() == 'GeneratedButNoResult' || data.status.trim()=='Waiting'){
          console.log('xxxx');
          const dialogRef = this['dialog'].open(PopupComponent, {
            width: '400px', 
            data: {
              message:popUpMsg,
              button:'OK',
              campaignId: campaignId, 
            },
          });
      
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
            }
          });

        this.isLoading = false;
        }
        else{
        this.campaignMembersList.paginator = this.paginator;
        this.campaignMembersList.data = data.targets.map((item: any) => ({ ...item, expanded: false }));
        this.originalCampaignMembersList.data= data.targets.map((item: any) => ({ ...item, expanded: false }));
        this.campaignMembersList.sort = this.sort;
        if (data) {
          this.campaignName=  localStorage.getItem('campaignName');
        }
      }
        this.isLoading = false;
      }
    );
    }
  }

  isExpanded(element: any): boolean {
    //console.log("Is Expanded:", element.expanded);
    //console.log("Is element:", element);
    return element.expanded;
  }

  toggleExpanded(element: any): void {
    this.isDetailRowExpanded = this.isExpanded(element);
    //console.log("Before toggle:", element.expanded);
    element.expanded = !element.expanded;
    //console.log("After toggle:", element.expanded);
  }

  loadDetailDataFromApi(element: any): void {
      this.campaignListService.getCampaignMemberdetails(element).subscribe(
        (data) => {
          element.detailData = data;
          //console.log(element);
        }
      );
  }

  downloadExcel(): void {
    const customHeadings: { [key: string]: string } = {
      'firstName': 'First Name',
      'comName': 'Company Name',
      'comCountry': 'Country',
      'perEmail': 'Email',
    };
  
    const selectedColumns = ['firstName', 'comName', 'comCountry', 'perEmail','personSource','personRole','companyJobType'];
    const selectedData = this.campaignMembersList.data.map(item => {
      const selectedValues: { [key: string]: any } = {}; 
  
      selectedColumns.forEach(column => {
        selectedValues[column] = item[column];
      });
  
      return selectedValues;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedData);
    const headers = selectedColumns.map(column => customHeadings[column] || column);
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const fileName = `${this.campaignName}-${formattedDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }
  
  applyFilter() {
    if (!this.searchTerm) {
      this.campaignMembersList.data = this.originalCampaignMembersList.data;
      return;
    }
    
    const filteredItems = this.originalCampaignMembersList.data.filter((item) => {

      switch (this.selectedFilter) {
        case 'firstName':
          return item.firstName.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        case 'comName':
          return item.comName.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        case 'comCountry':
          return item.comCountry.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        case 'perEmail':
          return item.perEmail.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        case 'personSource':
          return item.personSource.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        case 'personRole':
          return item.personRole.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        case 'companyJobType':
          return item.companyJobType.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        default:
          for (let key in item) {
            if (item.hasOwnProperty(key) && typeof item[key] === 'string' && item[key].toLowerCase().includes(this.searchTerm.trim().toLowerCase())) {
              return true; 
            }
          }
          return false;
      }
    });
    this.campaignMembersList.data = filteredItems;
  }

  clearFilter() {
    this.selectedFilter = "";
    this.searchTerm = "";
    this.campaignMembersList.data = this.originalCampaignMembersList.data;
  }

  onFilterChange(value: any,campaignId:number): void {

    this.selectedEmailFilter=value.value
    console.log(this.selectedEmailFilter);
    console.log(campaignId);

    const data={
      campaignId:campaignId,
      EmailFilter:this.selectedEmailFilter
    }
    this.isLoading = true;

    this.campaignListService.GetTargetsByEmailFilter(data).subscribe(
      (Result: any) => {
        this.campaignMembersList.data = Result.targets.map((item: any) => ({ ...item, expanded: false }));
        this.isLoading = false;
      }
    );



  }
}
