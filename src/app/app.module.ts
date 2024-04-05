import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './content/home/home.component';
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CampaignFormComponent } from './content/home/campaign-form/campaign-form.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CampaignListComponent } from './content/home/campaign-list/campaign-list/campaign-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditCampaignComponent } from './content/home/edit-campaign/edit-campaign.component';
import { CampaignResultComponent } from './content/home/campaign-result/campaign-result.component';
import { MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { CampaignMatchedMembersComponent } from './content/home/campaign-matched-members/campaign-matched-members.component';
import { CampaignGraphicalResultAnalysisComponent } from './content/home/campaign-graphical-result-analysis/campaign-graphical-result-analysis.component';
import { LoginComponent } from './Auth/login/login.component';
import { TokenInterceptorService } from './service/auth/token-interceptor.service';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PopupComponent } from './content/home/popup/popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilterPopupComponent } from './content/home/filter-popup/filter-popup.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BlastPopupComponent } from './content/home/blast-popup/blast-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReceptionistComponent } from './Auth/receptionist/receptionist.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    CampaignFormComponent,
    CampaignListComponent,
    EditCampaignComponent,
    CampaignResultComponent,
    CampaignMatchedMembersComponent,
    CampaignGraphicalResultAnalysisComponent,
    LoginComponent,
    PopupComponent,
    FilterPopupComponent,
    BlastPopupComponent,
    ReceptionistComponent,
  ],
  imports: [
    BrowserModule,
    MatCardModule,FormsModule,ReactiveFormsModule,
    AppRoutingModule,HttpClientModule,
    BrowserAnimationsModule,MatTableModule,
    MatIconModule,
    MatSnackBarModule,MatSortModule,CommonModule,MatExpansionModule,
    MatProgressSpinnerModule,MatDialogModule,
    MatPaginatorModule,MatFormFieldModule, MatInputModule, MatTableModule,MatSelectModule,
    MatDatepickerModule,MatAutocompleteModule,MatRadioModule,MatCheckboxModule
    ,MatSelectModule
  ],
  providers: [DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
