import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardCardsComponent } from '../../components/dashboard-cards/dashboard-cards.component';
import { TopProductsComponent } from '../../components/top-products/top-products.component';
import { MonthlyChartComponent } from '../../components/monthly-chart/monthly-chart.component';
import {
  DatepickerComponent,
  DateRange,
} from '../../components/datepicker/datepicker.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { LucideAngularModule, Calendar, Store, Clock, SlidersHorizontal } from 'lucide-angular';
import { PopupComponent, PopupAction } from '../../components/popup/popup.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    DashboardCardsComponent,
    TopProductsComponent,
    MonthlyChartComponent,
    DatepickerComponent,
    SelectComponent,
    PopupComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedDate: Date | DateRange | null = new Date();
  selectedFilter: string | number | null = 'all';
  branchName: string = 'All Branches';

  isFilterModalOpen = signal(false);
  
  // Temporary filter values for the modal
  tempSelectedDate: Date | DateRange | null = new Date();
  tempSelectedFilter: string | number | null = 'all';
  tempSelectedShift: string | number | null = 'all';

  public readonly icons = { Calendar, Store, SlidersHorizontal };
  public readonly shiftIcons = { Clock };

  branches: SelectOption[] = [
    { id: 'all', name: 'All Branches' },
    { id: 'Adenta', name: 'Adenta Old' },
    { id: 'Kumasi', name: 'Kumasi Main' },
    { id: 'Accra', name: 'Circle' },
  ];

  shifts: SelectOption[] = [
    { id: 'all', name: 'All Shifts' },
    { id: 'morning', name: 'Morning' },
    { id: 'afternoon', name: 'Afternoon' },
    { id: 'night', name: 'Night' },
  ];

  selectedShift: string | number | null = 'all';
  shiftName: string = 'All Shifts';

  branchData = [
    { id: 'Adenta', name: 'Adenta Old', location: 'Adenta, Greater Accra' },
    { id: 'Kumasi', name: 'Kumasi Main', location: 'Kumasi, Ashanti Region' },
    { id: 'Accra', name: 'Circle', location: 'Circle, Greater Accra' },
  ];

  branchSearchForm = new FormGroup({
    branchSearch: new FormControl<string>(''),
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['branch']) {
        this.selectedFilter = params['branch'];
        this.branchName = this.getFilterName(params['branch']);
      }
    });
  }

  ngOnDestroy(): void {}

  onDateChange(date: Date | DateRange | null): void {
    this.selectedDate = date;
    console.log('Selected date:', date);
  }

  onFilterChange(value: string | number | null): void {
    this.selectedFilter = value;
    this.branchName = this.getFilterName(value);
    this.updateUrl();
    console.log('Selected filter:', value);
  }

  onShiftChange(value: string | number | null): void {
    this.selectedShift = value;
    this.shiftName = this.getShiftName(value);
    console.log('Selected shift:', value);
  }

  // Filter modal methods
  openFilterModal(): void {
    // Load current values into temp variables
    this.tempSelectedDate = this.selectedDate;
    this.tempSelectedFilter = this.selectedFilter;
    this.tempSelectedShift = this.selectedShift;
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
  }

  applyFilters(): void {
    // Apply temp values to actual values
    this.selectedDate = this.tempSelectedDate;
    this.selectedFilter = this.tempSelectedFilter;
    this.selectedShift = this.tempSelectedShift;
    this.branchName = this.getFilterName(this.tempSelectedFilter);
    this.shiftName = this.getShiftName(this.tempSelectedShift);
    this.updateUrl();
    this.closeFilterModal();
  }

  onTempDateChange(date: Date | DateRange | null): void {
    this.tempSelectedDate = date;
  }

  onTempFilterChange(value: string | number | null): void {
    this.tempSelectedFilter = value;
  }

  onTempShiftChange(value: string | number | null): void {
    this.tempSelectedShift = value;
  }

  get hasActiveFilters(): boolean {
    return (
      (this.selectedFilter && this.selectedFilter !== 'all') ||
      (this.selectedShift && this.selectedShift !== 'all') ||
      (this.selectedDate !== null)
    );
  }

  get filterModalPrimaryAction(): PopupAction {
    return {
      label: 'Apply Filters',
      variant: 'primary',
      icon: this.icons.SlidersHorizontal,
      action: () => this.applyFilters(),
    };
  }

  get filterModalSecondaryAction(): PopupAction {
    return {
      label: 'Cancel',
      variant: 'secondary',
      action: () => this.closeFilterModal(),
    };
  }

  clearAllFilters(): void {
    this.selectedDate = new Date();
    this.selectedFilter = 'all';
    this.selectedShift = 'all';
    this.branchName = 'All Branches';
    this.shiftName = 'All Shifts';
    this.updateUrl();
  }

  getFilterName(value: string | number | null): string {
    if (!value) return '';
    const option = this.branches.find((opt) => opt.id === value);
    return option ? option.name : '';
  }

  get filteredBranches() {
    return this.branchData;
  }

  isDateRange(value: any): value is DateRange {
    return value && typeof value === 'object' && 'start' in value;
  }

  private getShiftName(value: string | number | null): string {
    if (!value) return '';
    const option = this.shifts.find((opt) => opt.id === value);
    return option ? option.name : '';
  }

  private updateUrl(): void {
    const queryParams: any = {};

    if (this.selectedFilter && this.selectedFilter !== 'all') {
      queryParams.branch = this.selectedFilter;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

}
