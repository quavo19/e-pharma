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
import { LucideAngularModule, Calendar, Store, Clock } from 'lucide-angular';

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
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedDate: Date | DateRange | null = new Date();
  selectedFilter: string | number | null = 'all';
  branchName: string = 'All Branches';

  showPopup = signal(false);

  public readonly icons = { Calendar, Store };
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

  openPopup(): void {
    this.showPopup.set(true);
  }

  closePopup(): void {
    this.showPopup.set(false);
  }

  onConfirm(): void {
    console.log('Confirmed action');
    this.closePopup();
  }

  onCancel(): void {
    console.log('Cancelled action');
    this.closePopup();
  }
}
