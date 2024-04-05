import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { CampaignService } from 'src/app/service/functional/campaign.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-blast-popup',
  templateUrl: './blast-popup.component.html',
  styleUrls: ['./blast-popup.component.css']
})

export class BlastPopupComponent implements OnInit {

  selectedBlastId!: number; 
  constructor(
    private campaignListService: CampaignService,
    private router: Router,
    public dialogRef: MatDialogRef<BlastPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  ngOnInit(): void {
  }

  onCancelButtonClick(): void {
    this.dialogRef.close();
  }
  onApplyButtonClick(campaignId: number): void {
    if(this.selectedBlastId ){
    this.campaignListService.getCampaignGraphicalData(campaignId,this.selectedBlastId ).subscribe(
    (data: any) => {
      this.router.navigate(['home/campaign-analysis', campaignId]);
      window.location.reload();
    });
   }
    this.dialogRef.close();
  }
  
  formatDate(dateString: string): string {
    const dateParts = dateString.split('/');
    const day = parseInt(dateParts[0], 10);
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dateTimeParts = dateString.split(' ');
    var timeParts = dateTimeParts[1];
    var hour;
    var minute;
    if (!timeParts){
      timeParts='' 
    }
    
    console.log(timeParts)

    return `${day} ${months[monthIndex]} ${year} ${timeParts}`;
  }

}
