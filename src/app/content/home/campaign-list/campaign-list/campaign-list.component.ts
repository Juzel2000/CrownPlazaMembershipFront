import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/service/functional/campaign.service';
import { CommonService } from 'src/app/service/functional/common.service';
import { AuthentictionService} from 'src/app/service/auth/authentication.service'
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit {
  //displayedColumns: string[] = ['campaignName', 'startDate', 'endDate', 'action'];
  displayedColumns: string[] = ['voucherName', 'isReedemed', 'details', 'action'];
  campaignList: MatTableDataSource<any>;
  originalcampaignList: MatTableDataSource<any>;
  isLoading = false;
  searchTerm!: string ;

  guest: any;
  // name: string = '';
  // startDate: any = [];
  // endDate:  any = [];

  
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 20; // Initial page size
  pageIndex = 0; // Initial page index
  length=500

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  formatDate: (dateString: string) => string;

  constructor(private campaignListService: CampaignService, private router: Router, private commonService:CommonService, private Authservice:AuthentictionService,private dialog: MatDialog) {

    this.campaignList = new MatTableDataSource<any>([]);
    this.originalcampaignList =  new MatTableDataSource<any>([]);
    this.formatDate = this.commonService.formatDate;
  }

  ngOnInit(): void {

    this.isLoading = true;
    // this.campaignListService.getCampaignList().subscribe(
    //   (data: any) => {
        
    //     this.campaignList = new MatTableDataSource<any>(data);
    //     this.campaignList.paginator = this.paginator;
    //     this.campaignList.sort = this.sort;
    //     this.originalcampaignList =  new MatTableDataSource<any>(data);
    //     this.isLoading = false;
    //   }
    // );

    
    this.isLoading = false;
  }

  onViewMembers(element: any): void {
    // localStorage.setItem('campaignName', element.campaignName);
    // this.router.navigate(['home/campaign-members/', element.campaignId]);
    this.isLoading = true;
    
    this.Authservice.RedeemVoucher(element).subscribe({
      next: (response: any) => {
       
        
        let popUpMsg='';
        if(response.message=='redeemed'){

          popUpMsg= 'Redeemed';  
        }
        else{
          popUpMsg="Not redeemed"
        }

        const dialogRef = this['dialog'].open(PopupComponent, {
          width: '400px', 
          data: {
            message:popUpMsg,
            button:'OK',
            //campaignId: campaignId, 
          },
        });
    
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
          }
        });

        //debugger;
        this.applyFilter()



        this.isLoading = false;

       },
      error: (error) => {
        console.error('Error posting data', error);
      },
    });
    this.isLoading = false;


  }


  // formatDate(dateString: string): string {
  //   const dateParts = dateString.split('/');
  //   const day = parseInt(dateParts[0], 10);
  //   const monthIndex = parseInt(dateParts[1], 10) - 1;
  //   const year = parseInt(dateParts[2], 10);
  //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   return `${day} ${months[monthIndex]} ${year}`;
  // }
  
  applyFilter() {
   //debugger
    if (!this.searchTerm) {
      this.campaignList.data = this.originalcampaignList.data;
      return;
    }
    this.isLoading = true;

    // const filteredItems = this.originalcampaignList.data.filter((item) => {
    //   return Object.values(item).some((value) => {
    //     if (typeof value === 'string') {
    //       return value.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
    //     }
    //     return false;
    //   });
    // });
    // this.campaignList.data = filteredItems;

    // this.Authservice.GetVoucherListByMembNo().subscribe(
    //   (data: any) => {
        
    //     this.campaignList = new MatTableDataSource<any>(data);
    //     this.campaignList.paginator = this.paginator;
    //     this.campaignList.sort = this.sort;
    //     this.originalcampaignList =  new MatTableDataSource<any>(data);
    //     this.isLoading = false;
    //   }
    // );
    const data ={
      MembershipNo:this.searchTerm
    }
    this.Authservice.GetVoucherListByMembNo(data).subscribe({
      next: (response: any) => {

        this.guest = null;
        this.campaignList.data = [];

        let popUpMsg='';
        if(response.message=='NotGuest'){

          popUpMsg= 'There is no Guest corresponding to the membership Number';

          console.log('xxxx');
          const dialogRef = this['dialog'].open(PopupComponent, {
            width: '400px', 
            data: {
              message:popUpMsg,
              button:'OK',
              //campaignId: campaignId, 
            },
          });
      
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
            }
          });

          this.isLoading = false;
        }
        else{

          this.isLoading = true;
          //this.campaignMembersList.data = Result.targets.map((item: any) => ({ ...item, expanded: false }));
          this.campaignList.data = response.vouchers.map((item: any) => ({ ...item, expanded: false }));
          console.log(this.campaignList.data);
          this.originalcampaignList =  new MatTableDataSource<any>(response);
          this.isLoading = false;
          this.campaignList.paginator = this.paginator;
          this.campaignList.sort = this.sort;
          this.isLoading = false;

          this.guest= response.guest;
          console.log(this.guest);

        }

       },
      error: (error) => {
        console.error('Error posting data', error);
      },
    });


  }
  
  

  clearFilter() {
    this.searchTerm = "";
    this.campaignList.data = this.originalcampaignList.data;
  }
}
  