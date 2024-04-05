import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './content/home/home.component';
import { CampaignFormComponent } from './content/home/campaign-form/campaign-form.component';
import { CampaignListComponent } from './content/home/campaign-list/campaign-list/campaign-list.component';
import { EditCampaignComponent } from './content/home/edit-campaign/edit-campaign.component';
import { CampaignResultComponent } from './content/home/campaign-result/campaign-result.component';
import { CampaignMatchedMembersComponent } from './content/home/campaign-matched-members/campaign-matched-members.component';
import { CampaignGraphicalResultAnalysisComponent } from './content/home/campaign-graphical-result-analysis/campaign-graphical-result-analysis.component';
import { LoginComponent } from './Auth/login/login.component';
import { AuthGuard } from './service/auth/auth.guard';
import { ReceptionistComponent } from './Auth/receptionist/receptionist.component';

const routes: Routes = [
  {path:'',redirectTo:'receptionist',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'receptionist',component:ReceptionistComponent},
  {path:'home',component:HomeComponent,canActivate: [AuthGuard],
    children:[
      {path:'campaign-list',component:CampaignListComponent},
      {path:'campaign-add',component:CampaignFormComponent},
      { path: 'edit-campaign/:id', component: EditCampaignComponent },
      { path: 'campaign-result/:id', component: CampaignResultComponent },
      { path: 'campaign-members/:id', component: CampaignMatchedMembersComponent },
      { path: 'campaign-analysis/:id', component: CampaignGraphicalResultAnalysisComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
