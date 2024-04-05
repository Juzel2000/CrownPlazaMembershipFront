import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from 'src/app/service/functional/campaign.service';
import { BlastPopupComponent } from '../blast-popup/blast-popup.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as XLSX from 'xlsx';
import { PopupComponent } from '../popup/popup.component';


@Component({
  selector: 'app-campaign-graphical-result-analysis',
  templateUrl: './campaign-graphical-result-analysis.component.html',
  styleUrls: ['./campaign-graphical-result-analysis.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CampaignGraphicalResultAnalysisComponent implements OnInit {

  isLoading = false;
  campaignData: any;
  campaignBlastData: any;
  campaignName: string | null = null;
  campaignId: any;
  dataSource!: MatTableDataSource<any>;
  originalDataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [ 'activeAI','name', 'company', 'chairman', 'email', 'createdDate', 'type', 'priorityTags', 'pinned', 'emailblast','followUp'];
  columnsToDisplayWithExpand = ['expand', ...this.displayedColumns];
  searchTerm!: string ;
  isDetailRowExpanded=false;

  selectedFilter='EmailsIncluded';
  

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private campaignListService: CampaignService,private route: ActivatedRoute,private dialog: MatDialog) { 
    this.dataSource = new MatTableDataSource<any>();
    this.originalDataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    console.log('s');

    this.isLoading = true;
    const campaignIdParam = this.route.snapshot.paramMap.get('id');

    if (campaignIdParam !== null) {
      const campaignId = parseInt(campaignIdParam, 10);

      if (!isNaN(campaignId)) {
        const campaignId = this.route.snapshot.paramMap.get('id');
      }
      const blastId = 0;
     this.campaignListService.getCampaignGraphicalData(campaignId,blastId).subscribe(
      (data: any) => {

        let popUpMsg='';
        if(data.generateStatus.trim()=='Waiting'){

           popUpMsg= 'The campaign result is generating.Please wait.....';
        }

        else if(data.generateStatus.trim()=='GeneratedButNoResult'){
           popUpMsg= 'No members exist for this campaign.';
        }
        else if(data.generateStatus.trim()=='NotGenerated'){
           popUpMsg= 'The campaign result is not generated.Please generate it on edit campaign.';
          
        }

        if(data.generateStatus.trim()=='NotGenerated' || data.generateStatus.trim() == 'GeneratedButNoResult' || data.generateStatus.trim()=='Waiting'){
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

         this.campaignData =data;
         this.dataSource.data = data.blastTargetList.map((item: any) => ({ ...item, expanded: false }));
         this.originalDataSource.data = data.blastTargetList.map((item: any) => ({ ...item, expanded: false }));
         this.dataSource.sort = this.sort;
         this.dataSource.paginator = this.paginator;
         this.campaignId =campaignId;
         this.isLoading = false;
         this.campaignName= data.campaignName;
        }
     

      });
    }
  }

  getBlastData(campaignId: number) {

    this.isLoading = true;
    this.campaignListService.getCampaignBlastData(campaignId).subscribe(
      (data: any) => {
      const dialogRef = this.dialog.open(BlastPopupComponent, {
        data: data
      });
      });

      this.isLoading = false;

  }

  toggleRow(row: { expanded: boolean; }) {
    row.expanded = !row.expanded;
  }

  applyFilter() {
   
    this.isLoading = true;
    if (!this.searchTerm) {
      this.dataSource.data = this.originalDataSource.data;
      return;
    }

    const filteredItems = this.originalDataSource.data.filter((item) => {
      return Object.values(item).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
        }
        return false;
      });
    });
    this.dataSource.data = filteredItems;

    this.isLoading = false;
  }
 

  clearFilter() {
    this.searchTerm = "";
    this.dataSource.data = this.originalDataSource.data;
  }


  formatDate(dateString: string): string {
    const dateParts = dateString.split('/');
    const day = parseInt(dateParts[0], 10);
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[monthIndex]} ${year}`;
  }


  isExpanded(element: any): boolean {
    //console.log("Is Expanded:", element.expanded);
    //console.log("Is element:", element);
    return element.expanded;
  }

  toggleExpanded(element: any): void {
    this.isDetailRowExpanded = this.isExpanded(element);
   // console.log("Before toggle:", element.expanded);
    element.expanded = !element.expanded;
   // console.log("After toggle:", element.expanded);
  
  }

  getColumnHeader(column: string): string {
    switch (column) {
      case 'name':
        return 'Name';
      case 'company':
        return 'Company';
      case 'chairman':
        return 'Chairman';
      case 'email':
        return 'Email';
      case 'createdDate':
        return 'Created Date';
      case 'type':
        return 'Type';
      case 'priorityTags':
        return 'Priority Tags';
      case 'pinned':
        return 'Pinned';
      case 'emailblast':
        return 'Email Blast';
      case 'followUp':
        return 'Follow Up';
      case 'activeAI':
        return 'Active AI';
      default:
        return column;
    }
  }
 

  getTagClass(tag: string): string {
    switch (tag) {
      case 'C-Suite':
        return 'blue-square';
      case 'Subscriber':
        return 'lightblue-square';
      case 'Past Delegate':
        return 'lightviolet-square';
      case 'Past sponsor':
          return 'red-square';  
      default:
        return 'default-square';
    }
  }


  downloadExcel():void {

    const customHeadings: { [key: string]: string } = {
      'name': 'Name',
      'company': 'Company',
      'chairman': 'Chairman',
      'email': 'Email',
      'createdDate': 'Created Date',
      'type' : 'Type'
    };
    const selectedColumns = ['name', 'company', 'chairman', 'email','createdDate','type'];

    const selectedData = this.dataSource.data.map(item => {
      const selectedValues: { [key: string]: any } = {}; 
  
      selectedColumns.forEach(column => {
        selectedValues[column] = item[column];
      });
  
      return selectedValues;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedData);
    const headers = selectedColumns.map(column => customHeadings[column] ||  column);
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const fileName = `${this.campaignName}-${formattedDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }


  onPinnedCheckboxchange(event: any, element: any) {

    element.pinned=event.target.checked

    this.campaignListService.postTargetList(element).subscribe({
      next: response => {
        this.isLoading = false;
      },
      error: error => {

        //this.alert.showError(error);
        this.isLoading = false;
        console.error('Error posting data', error);
      }
    });
    console.log(element)
    console.log(event.target.checked)
  }

  onFilterChange(value: any,campaignId:number): void {

    this.selectedFilter=value.value
    console.log(this.selectedFilter);
    console.log(campaignId);

    const data={
      campaignId:campaignId,
      EmailFilter:this.selectedFilter
    }
    this.isLoading = true;

    this.campaignListService.postTargetDatabyEmailFilter(data).subscribe(
      (Result: any) => {
        this.dataSource.data = Result.blastTargetList.map((item: any) => ({ ...item, expanded: false }));
        this.isLoading = false;
      }
    );



  }
  
  
}
