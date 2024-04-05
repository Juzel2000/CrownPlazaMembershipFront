import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPopupComponent } from './filter-popup.component';

describe('FilterPopupComponent', () => {
  let component: FilterPopupComponent;
  let fixture: ComponentFixture<FilterPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
