import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup',
  styleUrls: ['popup.component.css'],
  templateUrl: 'popup.component.html'
})
export class PopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string,button:string,campaignId: string }, private router: Router,private dialogRef: MatDialogRef<PopupComponent>) {}

  onViewMemberButtonClick(): void {
    // const campaignId = this.data.campaignId;
    // this.router.navigate(['home/campaign-members', campaignId]);
    this.router.navigate(['home/campaign-list']);
    this.dialogRef.close();
  }
}
