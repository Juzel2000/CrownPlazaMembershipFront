import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlastPopupComponent } from './blast-popup.component';

describe('BlastPopupComponent', () => {
  let component: BlastPopupComponent;
  let fixture: ComponentFixture<BlastPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlastPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlastPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
