import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/service/functional/campaign.service';
import { SnackbarService } from 'src/app/service/functional/snackbar.service';
import { Injectable } from '@angular/core';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';

@Injectable()
export class PickDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date, 'dd MMM yyyy', this.locale);
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: {
        parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
        display: {
            dateInput: 'input',
            monthYearLabel: { year: 'numeric', month: 'short' },
            dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
            monthYearA11yLabel: { year: 'numeric', month: 'long' }
        }
    } }
  ]
})
export class CampaignFormComponent implements OnInit {
  @ViewChild('nameInput') nameInput!: NgModel;
  @ViewChild('startDateInputRef') startDateInputRef!: NgModel;
  @ViewChild('endDateInputRef') endDateInputRef!: NgModel;

  

  @ViewChild('selectAllCountryCheckbox')selectAllCountryCheckbox!: ElementRef;
  @ViewChild('selectAllCountryGroupCheckbox')selectAllCountryGroupCheckbox!: ElementRef;
  @ViewChild('selectAllCompanyGroupCheckbox')selectAllCompanyGroupCheckbox!: ElementRef;
  @ViewChild('selectAllCompanyJobTypeCheckbox')selectAllCompanyJobTypeCheckbox!: ElementRef;
  @ViewChild('selectAllConferenceCheckbox')selectAllConferenceCheckbox!: ElementRef;
  @ViewChild('selectAllAwardCheckbox')selectAllAwardCheckbox!: ElementRef;
  @ViewChild('selectAllCompanyClassesWrittenCheckbox')selectAllCompanyClassesWrittenCheckbox!: ElementRef;
  @ViewChild('selectAllTopReadersCheckbox')selectAllTopReadersCheckbox!: ElementRef;

  @ViewChild('strictCheckbox')strictCheckbox!: ElementRef;
  

  groupControl = new FormControl();
  groupCategoryControl = new FormControl();
  dataTypeControl = new FormControl();

  selectedGroup!: number;
  selectedGroupCategory!: number;
  selectedDataType!: number;

  filterValuesPersonDesignation: { option: string, value: string }[] = [];

  data: any = [];
  name: string = '';
  startDate: any = [];
  endDate: any = [];

  groupCategoryOfGroup: any = [];

  selectedCountryGroupCheckboxes: any[] = [];
  selectedCompanyGroupCheckboxes: any[] = [];
  selectedCompanyClassesWrittenCheckboxes: any[] = [];
  selectedPersonSourceCheckboxes: any[] = [];
  selectedCountryCheckboxes: any[] = [];
  selectedCompanyJobTypeCheckboxes: any[] = [];
  selectedCompanyCheckboxes: any[] = [];
  selectedPersonDesignationCheckboxes: any[] = [];
  selectedConferenceCheckboxes: any[] = [];
  selectedAwardCheckboxes: any[] = [];
  selectedTopReadersCheckboxes: any[] = [];

  strictCompanyClassesWrittenCheckbox: boolean = false;
  strictPersonDesignationCheckbox: boolean = false;
  strictSubscribersCheckbox: boolean = false;

  subscribersCheckbox: boolean = false;
  nonSubscribersCheckbox: boolean = false;

  isLoading = false;
  strictPersonSourceCheckbox: boolean = false;
  strictCompanyCheckbox: boolean = false;
  

  constructor(private CampaignService: CampaignService, private alert:SnackbarService,private datePipe: DatePipe,private router: Router,
    private dialog: MatDialog) { }
  
    ngOnInit(): void {
      this.isLoading = true;
      this.CampaignService.getCampaign().subscribe(
        data => {
          this.data = data;
          this.isLoading = false;
        }
      );
    
      const currentDate = new Date();
      this.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      const futureDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
      this.endDate = this.datePipe.transform(futureDate, 'yyyy-MM-dd');
    }
 
    
  onCountryGroupCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedCountryGroupCheckboxes.push({ id: checkbox.id, countryGroupName: checkbox.countryGroupName });

      const updatedDataCountryGroup = this.data.countryGroup.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.countryGroup = updatedDataCountryGroup;
      // Add countries from the selected country group to selectedCountryCheckboxes
      for (const country of this.data.country) {
        if (country.countryGroupId === checkbox.id) {
          // Check if country.id already exists in selectedCountryCheckboxes
          const isCountryAlreadySelected = this.selectedCountryCheckboxes
            .map(selectedCountry => selectedCountry.id)
            .includes(country.id);
      
          // If the country is not already selected, push it to the array
          if (!isCountryAlreadySelected) {
            this.selectedCountryCheckboxes.push({
              id: country.id,
              countryName: country.countryName
            });
          }
        }
      }

      const updatedData = this.data.country.map((x:any) => (x['countryGroupId'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.country = updatedData;
    // End add countries from the selected country group to selectedCountryCheckboxes
    } else {
      const index = this.selectedCountryGroupCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedCountryGroupCheckboxes.splice(index, 1);
      }
    
      const updatedDataCountryGroup = this.data.countryGroup.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: false } : x));
      this.data.countryGroup = updatedDataCountryGroup;
      }
     
      this.selectAllCountryGroupCheckbox.nativeElement.checked = this.areAllCountriesGroupSelected();
      this.selectAllCountryCheckbox.nativeElement.checked = this.areAllCountriesSelected();
  }



  onCompanyGroupCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedCompanyGroupCheckboxes.push({ id: checkbox.id, companyGroupName: checkbox.companyGroupName });

      const updatedDataCompanyGroup = this.data.companyGroup.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.companyGroup = updatedDataCompanyGroup;
      // Add countries from the selected country group to selectedCountryCheckboxes
      for (const companyJobType of this.data.companyJobType) {
        if (companyJobType.companyGroupId === checkbox.id) {
          const isJobTypeAlreadySelected = this.selectedCompanyJobTypeCheckboxes
            .map(selectedJobType => selectedJobType.id)
            .includes(companyJobType.id);
      
          if (!isJobTypeAlreadySelected) {
            this.selectedCompanyJobTypeCheckboxes.push({
              id: companyJobType.id,
              jobTypeName: companyJobType.jobTypeName
            });
          }
        }
      }
      const updatedData = this.data.companyJobType.map((x:any) => (x['companyGroupId'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.companyJobType = updatedData;

    // End add countries from the selected country group to selectedCountryCheckboxes
    } else {
      const index = this.selectedCompanyGroupCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedCompanyGroupCheckboxes.splice(index, 1);
      }

      const updatedDataCompanyGroup = this.data.companyGroup.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: false } : x));
      this.data.companyGroup = updatedDataCompanyGroup;
    }
    this.selectAllCompanyGroupCheckbox.nativeElement.checked = this.areAllCompanyGroupSelected();
    this.selectAllCompanyJobTypeCheckbox.nativeElement.checked = this.areAllCompanyJobTypeSelected();

  }


  onCompanyClassesWrittenCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedCompanyClassesWrittenCheckboxes.push({ id: checkbox.id, companyClassesName: checkbox.companyClassesName });
      const updatedDataCompanyClassesWritten = this.data.companyClassesWritten.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.companyClassesWritten = updatedDataCompanyClassesWritten;
    } else {
      const index = this.selectedCompanyClassesWrittenCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedCompanyClassesWrittenCheckboxes.splice(index, 1);
      }
  
      const updatedDataCompanyClassesWritten = this.data.companyClassesWritten.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: false } : x));
      this.data.companyClassesWritten = updatedDataCompanyClassesWritten;
    }
    this.selectAllCompanyClassesWrittenCheckbox.nativeElement.checked = this.areAllCompanyClassesWrittenSelected();
    
  }

  onPersonSourceCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedPersonSourceCheckboxes.push({ id: checkbox.id, personSourceName: checkbox.personSourceName });
    } else {
      const index = this.selectedPersonSourceCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedPersonSourceCheckboxes.splice(index, 1);
      }
    }
  }



  onCountryCheckboxChange(event: any, checkbox: any) {

    if (event.target.checked) {
      this.selectedCountryCheckboxes.push({ id: checkbox.id, countryName: checkbox.countryName });

      const updatedDataCountry = this.data.country.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.country = updatedDataCountry;
    } else {
      const index = this.selectedCountryCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedCountryCheckboxes.splice(index, 1);
      }
   
      const updatedDataCountry = this.data.country.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: false } : x));
      this.data.country = updatedDataCountry;
    }
    this.selectAllCountryCheckbox.nativeElement.checked = this.areAllCountriesSelected();
  }


  onCompanyJobTypeCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedCompanyJobTypeCheckboxes.push({ id: checkbox.id, jobTypeName: checkbox.jobTypeName });
      const updatedDataCompanyJob= this.data.companyJobType.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.companyJobType = updatedDataCompanyJob;
    } else {
      const index = this.selectedCompanyJobTypeCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedCompanyJobTypeCheckboxes.splice(index, 1);
      }
  
      const updatedDataCompanyJob= this.data.companyJobType.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: false } : x));
      this.data.companyJobType = updatedDataCompanyJob;
    }
    this.selectAllCompanyJobTypeCheckbox.nativeElement.checked = this.areAllCompanyJobTypeSelected();
  }


  onCompanyCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedCompanyCheckboxes.push({ id: checkbox.id, company: checkbox.company });
    } else {
      const index = this.selectedCompanyCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedCompanyCheckboxes.splice(index, 1);
      }
    }
  }


  onPersonDesignationCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedPersonDesignationCheckboxes.push({ id: checkbox.id, personDesignationName: checkbox.personDesignationName });
    } else {
      const index = this.selectedPersonDesignationCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedPersonDesignationCheckboxes.splice(index, 1);
      }
    }
  }



  onConferenceNameCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedConferenceCheckboxes.push({ id: checkbox.id, conferenceName: checkbox.conferenceName });
      const updatedDataConference = this.data.conference.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.conference= updatedDataConference;
    } else {
      const index = this.selectedConferenceCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedConferenceCheckboxes.splice(index, 1);
      }
   
      const updatedDataConference = this.data.conference.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: false } : x));
      this.data.conference= updatedDataConference;
      }
     
      this.selectAllConferenceCheckbox.nativeElement.checked = this.areAllConferenceSelected();
  }



  onAwardCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedAwardCheckboxes.push({ id: checkbox.id, award: checkbox.award });

      const updatedDataAward = this.data.award.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.award= updatedDataAward;
    } else {
      const index = this.selectedAwardCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedAwardCheckboxes.splice(index, 1);
      }
    
      const updatedDataAward = this.data.award.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: false } : x));
      this.data.award= updatedDataAward;
      }
     
      this.selectAllAwardCheckbox.nativeElement.checked = this.areAllAwardSelected();
  }



  onTopReadersCheckboxChange(event: any, checkbox: any) {
    if (event.target.checked) {
      this.selectedTopReadersCheckboxes.push({ id: checkbox.id, topReader: checkbox.topReader });

      const updatedDataTopReaders = this.data.topReaders.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: true } : x));
      this.data.topReaders= updatedDataTopReaders;
    } else {
      const index = this.selectedTopReadersCheckboxes.findIndex(
        (selectedCheckbox) => selectedCheckbox.id === checkbox.id
      );
      if (index !== -1) {
        this.selectedTopReadersCheckboxes.splice(index, 1);
      }
    
      const updatedDataTopReaders = this.data.topReaders.map((x:any) => (x['id'] == checkbox.id ? { ...x, isSelected: false } : x));
      this.data.topReaders= updatedDataTopReaders;
    }

  this.selectAllTopReadersCheckbox.nativeElement.checked = this.areAllTopReadersSelected();
  }

  onSaveButtonClick() {
    // Collect selected checkboxes and prepare the data to send to the .NET API

    this.nameInput.control.markAsTouched();
    this.startDateInputRef.control.markAsTouched();
    this.endDateInputRef.control.markAsTouched();
    if (this.nameInput.control.invalid || 
      this.startDateInputRef.control.invalid || 
      this.endDateInputRef.control.invalid) {
      // Stop further execution if required fields are not filled
      return;
  }
    this.isLoading = true;


  const selectedGroup = this.groupControl.value ? (this.data.group.find((country: { name: string }) => country.name === this.groupControl.value)):null;
  const selectedGroupCategory =this.groupCategoryControl.value ? ( this.groupCategoryOfGroup.find((country: { name: string }) => country.name === this.groupCategoryControl.value)):null;
  const selectedDataType= this.dataTypeControl.value ? (this.data.dataType.find((country: { name: string }) => country.name === this.dataTypeControl.value)):null;

  const campaignDetails: any = {
    campaignId: 0,
    campaignName: this.name,
    addUserId: 1,
    startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
    endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
  };

    if (selectedGroup !== undefined && selectedGroup !== null) {
        campaignDetails.selectedGroup = selectedGroup.id;
    }

    if (selectedGroupCategory !== undefined && selectedGroupCategory !== null) {
        campaignDetails.selectedGroupCategory = selectedGroupCategory.id;
    }

    if (selectedDataType !== undefined && selectedDataType !== null) {
        campaignDetails.selectedDataType = selectedDataType.id;
    }


    const strict ={
      strictCompanyClassesWrittenCheckbox: this.strictCompanyClassesWrittenCheckbox,
      strictPersonDesignationCheckbox: this.strictPersonDesignationCheckbox,
      strictPersonSourceCheckbox: this.strictPersonSourceCheckbox,
      strictCompanyCheckbox: this.strictCompanyCheckbox,
      strictSubscribersCheckbox: this.strictSubscribersCheckbox,

    }

    const subscribers ={
      subscribersCheckbox : this.subscribersCheckbox,
      nonSubscribersCheckbox : this.nonSubscribersCheckbox,

    }
    const customFilters = {
      personDesignation : this.filterValuesPersonDesignation,
    }
    const selectedCheckboxesData = {
      campaign: campaignDetails,
      strictArray :strict,
      subscribers:subscribers,
      customFilter:customFilters,
      countryGroup: this.selectedCountryGroupCheckboxes.length > 0 ? this.selectedCountryGroupCheckboxes : null,
      companyGroup: this.selectedCompanyGroupCheckboxes.length > 0 ? this.selectedCompanyGroupCheckboxes : null,
      companyClassesWritten: this.selectedCompanyClassesWrittenCheckboxes.length > 0 ? this.selectedCompanyClassesWrittenCheckboxes : null,
      personSource: this.selectedPersonSourceCheckboxes.length > 0 ? this.selectedPersonSourceCheckboxes : null,
      country: this.selectedCountryCheckboxes.length > 0 ? this.selectedCountryCheckboxes : null,
      companyJobType: this.selectedCompanyJobTypeCheckboxes.length > 0 ? this.selectedCompanyJobTypeCheckboxes : null,
      company: this.selectedCompanyCheckboxes.length > 0 ? this.selectedCompanyCheckboxes : null,
      personDesignation: this.selectedPersonDesignationCheckboxes.length > 0 ? this.selectedPersonDesignationCheckboxes : null,
      conference: this.selectedConferenceCheckboxes.length > 0 ? this.selectedConferenceCheckboxes : null,
      award: this.selectedAwardCheckboxes.length > 0 ? this.selectedAwardCheckboxes : null,
      topReaders: this.selectedTopReadersCheckboxes.length > 0 ? this.selectedTopReadersCheckboxes : null,
    };
 
    this.CampaignService.postData(selectedCheckboxesData).subscribe({
      next: response => {
        this.alert.showSuccess(response.details);
        if(response.status!='Failed'){       
          this.router.navigate(['home/edit-campaign', response.campaignId]);
        }
        this.isLoading = false;
      },
      error: error => {

        this.alert.showError(error);
        this.isLoading = false;
        console.error('Error posting data', error);
      }
    });
  }

  
  onSelectAllCountryChange(event: any) {
    const isChecked = event.target.checked;
    this.data.country.forEach((country: { id: any; isSelected: any; }) => {
      country.isSelected = isChecked;
    });

    if (isChecked) {
     
      this.selectedCountryCheckboxes = this.data.country.map((country: { id: any; countryName: any; }) => {
        return {
          id: country.id,
          countryName: country.countryName
        };
      });
    } else {
      this.selectedCountryCheckboxes = [];
    }
  
  }
  
  areAllCountriesSelected(): boolean {
    return this.data.country.every((country: { isSelected: any; }) => country.isSelected);
  }


  onSelectAllCountryGroupChange(event: any) {
    const isChecked = event.target.checked;
    this.data.countryGroup.forEach((countryGroup: { id: any; isSelected: any; }) => {
      countryGroup.isSelected = isChecked;
    });

    if (isChecked) {
     
      this.selectedCountryGroupCheckboxes = this.data.countryGroup.map((countryGroup: { id: any; countryGroupName: any; }) => {
        return {
          id: countryGroup.id,
          countryGroupName: countryGroup.countryGroupName
        };
      });

      this.onSelectAllCountryChange(event);
      this.selectAllCountryCheckbox.nativeElement.checked = this.areAllCountriesSelected();
    } else {
      this.selectedCountryGroupCheckboxes = [];
    }
  
  }
  
  areAllCountriesGroupSelected(): boolean {
    return this.data.countryGroup.every((countryGroup: { isSelected: any; }) => countryGroup.isSelected);
  }
  
  onSelectAllCompanyGroupChange(event: any) {
    const isChecked = event.target.checked;
    this.data.companyGroup.forEach((companyGroup: { id: any; isSelected: any; }) => {
      companyGroup.isSelected = isChecked;
    });

    if (isChecked) {
     
      this.selectedCompanyGroupCheckboxes = this.data.companyGroup.map((companyGroup: { id: any; companyGroupName: any; }) => {
        return {
          id: companyGroup.id,
          companyGroupName: companyGroup.companyGroupName
        };
      });
      this.onSelectAllCompanyJobTypeChange(event);
      this.selectAllCompanyJobTypeCheckbox.nativeElement.checked = this.areAllCompanyJobTypeSelected();
    } else {
      this.selectedCompanyGroupCheckboxes = [];
    }
  }
  
  areAllCompanyGroupSelected(): boolean {
    return this.data.companyGroup.every((companyGroup: { isSelected: any; }) => companyGroup.isSelected);
  }
  onSelectAllCompanyJobTypeChange(event: any) {
    const isChecked = event.target.checked;
    this.data.companyJobType.forEach((companyJobType: { id: any; isSelected: any; }) => {
      companyJobType.isSelected = isChecked;
    });

    if (isChecked) {
     
      this.selectedCompanyJobTypeCheckboxes = this.data.companyJobType.map((companyJobType: { id: any; jobTypeName: any; }) => {
        return {
          id: companyJobType.id,
          jobTypeName: companyJobType.jobTypeName
        };
      });
    } else {
      this.selectedCompanyJobTypeCheckboxes = [];
    }
  
  }
  
  areAllCompanyJobTypeSelected(): boolean {
    return this.data.companyJobType.every((companyJobType: { isSelected: any; }) => companyJobType.isSelected);
  }


  onSelectAllConferenceChange(event: any) {
    const isChecked = event.target.checked;
    this.data.conference.forEach((conference: { id: any; isSelected: any; }) => {
      conference.isSelected = isChecked;
    });

    if (isChecked) {
     
      this.selectedConferenceCheckboxes = this.data.conference.map((conference: { id: any; conferenceName: any; }) => {
        return {
          id: conference.id,
          conferenceName: conference.conferenceName
        };
      });
    } else {
      this.selectedConferenceCheckboxes = [];
    }
  
  }
  
  areAllConferenceSelected(): boolean {
    return this.data.conference.every((conference: { isSelected: any; }) => conference.isSelected);
  }
  onSelectAllAwardChange(event: any) {
    const isChecked = event.target.checked;
    this.data.award.forEach((award: { id: any; isSelected: any; }) => {
      award.isSelected = isChecked;
    });

    if (isChecked) {
     
      this.selectedAwardCheckboxes = this.data.award.map((award: { id: any; awardName: any; }) => {
        return {
          id: award.id,
          awardName: award.awardName
        };
      });
    } else {
      this.selectedAwardCheckboxes = [];
    }
  
  }
  
  areAllAwardSelected(): boolean {
    return this.data.companyClassesWritten.every((companyClassesWritten: { isSelected: any; }) => companyClassesWritten.isSelected);
  }
  onSelectAllCompanyClassesWrittenChange(event: any) {
    const isChecked = event.target.checked;
    this.data.companyClassesWritten.forEach((companyClassesWritten: { id: any; isSelected: any; }) => {
      companyClassesWritten.isSelected = isChecked;
    });

    if (isChecked) {
     
      this.selectedCompanyClassesWrittenCheckboxes = this.data.companyClassesWritten.map((companyClassesWritten: { id: any; companyClassesName: any; }) => {
        return {
          id: companyClassesWritten.id,
          companyClassesName: companyClassesWritten.companyClassesName
        };
      });
    } else {
      this.selectedCompanyClassesWrittenCheckboxes = [];
    }
  
  }
  
  areAllCompanyClassesWrittenSelected(): boolean {
    return this.data.companyClassesWritten.every((companyClassesWritten: { isSelected: any; }) => companyClassesWritten.isSelected);
  }


  onSelectStrictCheckbox(event: any, type: any) {
    const isChecked = event.target.checked;
    if (type=='companyClassesWritten') {
      this.strictCompanyClassesWrittenCheckbox = isChecked ? true : false;
    }
    if (type=='personDesignation') {
      this.strictPersonDesignationCheckbox = isChecked ? true : false;
    }
    if (type=='personSource') {
      this.strictPersonSourceCheckbox = isChecked ? true : false;
    }
    if (type=='company') {
      this.strictCompanyCheckbox = isChecked ? true : false;
    }
    if (type=='subscribers') {
      this.strictSubscribersCheckbox = isChecked ? true : false;
    }
  }

  onSelectAllTopReadersChange(event: any) {
    const isChecked = event.target.checked;
    this.data.topReaders.forEach((topReaders: { id: any; isSelected: any; }) => {
      topReaders.isSelected = isChecked;
    });

    if (isChecked) {
     
      this.selectedTopReadersCheckboxes = this.data.topReaders.map((topReaders: { id: any; topReader: any; }) => {
        return {
          id: topReaders.id,
          topReader: topReaders.topReader
        };
      });
    } else {
      this.selectedTopReadersCheckboxes = [];
    }
  
  }
  
  areAllTopReadersSelected(): boolean {
    return this.data.topReaders.every((topReader: { isSelected: any; }) => topReader.isSelected);
  }


  onSubscriberCheckboxChange(event: any, type: any) {

    const isChecked = event.target.checked;
    if (type=='subscribers') {
      this.subscribersCheckbox = isChecked ? true : false;
    }
    if (type=='nonSubscribers') {
      this.nonSubscribersCheckbox = isChecked ? true : false;
    }
  }

  openFilterPopup(filter?: { option: string, value: string }) {
    const dialogRef = this.dialog.open(FilterPopupComponent, {
      data: filter // Pass the filter data to the dialog
    });
  
    dialogRef.componentInstance.filterApplied.subscribe((filterData: { option: string, value: string }) => {
      if (filter) {
        const index = this.filterValuesPersonDesignation.indexOf(filter);
        if (index !== -1) {
          this.filterValuesPersonDesignation[index] = filterData;
        }
      } else {
        console.log(filterData);
        this.filterValuesPersonDesignation.push(filterData);
      }
    });
  }
  
  deleteFilter(filter: { option: string, value: string }) {
    const index = this.filterValuesPersonDesignation.indexOf(filter);
    if (index !== -1) {
      this.filterValuesPersonDesignation.splice(index, 1);
    }
  }

  onSelect(name: string,id:number,type : string) {
    if(type=='group'){
      this.selectedGroup = id;

      this.groupCategoryControl.setValue("");
      this.selectedGroupCategory =0;

         this.CampaignService.getGroupCategoryOfGroupCampaign(id).subscribe(
          data => {
               this.groupCategoryOfGroup = data;
          });
    }
    if(type=='groupCategory'){
      this.selectedGroupCategory = id;
    }
    if(type=='dataType'){
      this.selectedDataType = id;
    }
  }

}
