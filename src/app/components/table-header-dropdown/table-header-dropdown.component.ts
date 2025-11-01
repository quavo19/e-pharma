import {
  Component,
  signal,
  input,
  computed,
  HostListener,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

export interface TableHeaderDropdownOption {
  id: string | number;
  label: string;
}

@Component({
  selector: 'app-table-header-dropdown',
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './table-header-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderDropdownComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  options = input<TableHeaderDropdownOption[]>([]);
  enableSearch = input<boolean>(false);
  clearLabel = input<string>('Clear');
  placeholder = input<string>('Search...');
  queryParamKey = input.required<string>();
  dropdownWidth = input<string>('min-w-[120px]');

  isOpen = signal<boolean>(false);
  searchValue = signal<string>('');
  searchControl = new FormControl('');
  currentParamValue = signal<string | number | null>(null);
  private routeSubscription?: Subscription;

  filteredOptions = computed(() => {
    const opts = this.options();
    const searchTerm = this.searchValue().toLowerCase().trim();

    if (!searchTerm) return opts;

    return opts.filter((opt) => opt.label.toLowerCase().includes(searchTerm));
  });

  public readonly icons = {
    ChevronDown,
  };

  private onCaptureClick = (event: Event) => {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.isOpen() && !this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  };

  ngOnInit(): void {
    document.addEventListener('click', this.onCaptureClick, true);

    // Get initial value from URL
    const key = this.queryParamKey();
    const value = this.route.snapshot.queryParams[key];
    if (value) {
      this.currentParamValue.set(value);
    }

    // Subscribe to route changes
    this.routeSubscription = this.route.queryParams.subscribe((params) => {
      const paramValue = params[key];
      this.currentParamValue.set(paramValue || null);
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onCaptureClick, true);
    this.routeSubscription?.unsubscribe();
  }

  toggleDropdown(): void {
    const newValue = !this.isOpen();
    this.isOpen.set(newValue);
    if (!newValue) {
      // Reset search when closing
      this.searchControl.setValue('');
      this.searchValue.set('');
    }
  }

  selectItem(option: TableHeaderDropdownOption | null): void {
    const key = this.queryParamKey();
    const currentParams = { ...this.route.snapshot.queryParams };

    if (option) {
      currentParams[key] = option.id;
    } else {
      // Remove from query params
      delete currentParams[key];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
    });

    this.searchControl.setValue('');
    this.searchValue.set('');
    this.isOpen.set(false);
  }

  onSearchChange(): void {
    this.searchValue.set(this.searchControl.value || '');
  }

  closeDropdown(): void {
    this.searchControl.setValue('');
    this.searchValue.set('');
    this.isOpen.set(false);
  }
}
