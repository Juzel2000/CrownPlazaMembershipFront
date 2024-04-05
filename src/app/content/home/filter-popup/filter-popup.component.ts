import { Component, EventEmitter, Output, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.css']
})
export class FilterPopupComponent implements OnInit {
   selectedOption: string = '';
   filterValue: string = '';
   filterForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { option: string, value: string },
    private dialogRef: MatDialogRef<FilterPopupComponent>,
    private formBuilder: FormBuilder
  ) {
    if (data) {
      this.selectedOption = data.option;
      this.filterValue = data.value;
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.filterForm = this.formBuilder.group({
      selectedOption: [this.selectedOption, Validators.required],
      filterValue: [this.filterValue, Validators.required]
    });
  }

  save() {
    if (this.filterForm.valid) {
      const selectedOption = this.filterForm.get('selectedOption')?.value;
      const filterValue = this.filterForm.get('filterValue')?.value;
      this.filterApplied.emit({ option: selectedOption, value: filterValue });
      this.dialogRef.close();
    }
  }
  
  @Output() filterApplied = new EventEmitter<{ option: string, value: string }>();


  closeModal(): void {
    this.dialogRef.close();
  }
}
