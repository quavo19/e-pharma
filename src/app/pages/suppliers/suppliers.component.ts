import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  XCircle,
  SlidersHorizontal,
  Heart,
  Globe,
  MapPin,
  Phone,
  Mail,
  Star,
  Eye,
  ShoppingCart,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { FormBuilder } from '@angular/forms';
import { GHANA_REGIONS } from '../../constants/regions';
import { SupplierCardComponent } from '../../components/suppliers/supplier-card/supplier-card.component';
import { SupplierDetailsComponent } from '../../components/suppliers/supplier-details/supplier-details.component';
import { Review } from '../../components/suppliers/supplier-review/supplier-review.component';

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  country: string;
  region: string;
  isFavorite: boolean;
  contact?: string;
  email?: string;
  rating: number;
  reviewCount: number;
}

@Component({
  selector: 'app-suppliers',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    SelectComponent,
    PopupComponent,
    SupplierCardComponent,
    SupplierDetailsComponent,
  ],
  templateUrl: './suppliers.component.html',
})
export class SuppliersComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isViewModalOpen = signal(false);
  viewingSupplier: Supplier | null = null;
  favoriteFilter = signal<boolean | null>(null);
  countryFilter = signal<string | null>(null);
  regionFilter = signal<string | null>(null);

  filterForm = this.fb.group({
    favorite: new FormControl<boolean | null>(null),
    country: new FormControl<string | null>(null),
    region: new FormControl<string | null>(null),
    regionSearch: new FormControl<string>(''),
    countrySearch: new FormControl<string>(''),
  });

  public readonly icons = {
    Search,
    XCircle,
    SlidersHorizontal,
    Heart,
    Globe,
    MapPin,
    Phone,
    Mail,
    Star,
    Eye,
    ShoppingCart,
  };

  // Sample suppliers data
  suppliers: Supplier[] = [
    {
      id: 'SUP001',
      name: 'Johnson & Johnson',
      logo: 'https://blocks.astratic.com/img/general-img-landscape.png',
      country: 'USA',
      region: 'Greater Accra',
      isFavorite: false,
      contact: '+233 24 111 2222',
      email: 'contact@jnj.com',
      rating: 4.5,
      reviewCount: 128,
    },
    {
      id: 'SUP002',
      name: 'Tobinco Pharmaceuticals',
      logo: 'https://blocks.astratic.com/img/general-img-landscape.png',
      country: 'Ghana',
      region: 'Greater Accra',
      isFavorite: true,
      contact: '+233 24 222 3333',
      email: 'info@tobinco.com',
      rating: 4.8,
      reviewCount: 245,
    },
    {
      id: 'SUP003',
      name: 'Pfizer',
      logo: 'https://blocks.astratic.com/img/general-img-landscape.png',
      country: 'USA',
      region: 'Ashanti',
      isFavorite: false,
      contact: '+233 24 333 4444',
      email: 'ghana@pfizer.com',
      rating: 4.2,
      reviewCount: 89,
    },
    {
      id: 'SUP004',
      name: 'GlaxoSmithKline',
      logo: 'https://blocks.astratic.com/img/general-img-landscape.png',
      country: 'UK',
      region: 'Greater Accra',
      isFavorite: true,
      contact: '+233 24 444 5555',
      email: 'contact@gsk.com',
      rating: 4.7,
      reviewCount: 312,
    },
  ];

  // Country options
  countryOptions: SelectOption[] = [
    { id: 'Ghana', name: 'Ghana' },
    { id: 'USA', name: 'USA' },
    { id: 'UK', name: 'UK' },
    { id: 'Switzerland', name: 'Switzerland' },
  ];

  // Region options from constants
  regionOptions: SelectOption[] = GHANA_REGIONS.map((region) => ({
    id: region.id,
    name: region.name,
  }));

  // Favorite filter options
  favoriteOptions: SelectOption[] = [
    { id: 'true', name: 'Favorites Only' },
    { id: 'false', name: 'Non-Favorites' },
  ];

  // Computed filtered suppliers
  filteredSuppliers = computed(() => {
    let result = [...this.suppliers];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      result = result.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm) ||
          supplier.country.toLowerCase().includes(searchTerm) ||
          supplier.region.toLowerCase().includes(searchTerm)
      );
    }

    // Apply favorite filter
    const favorite = this.favoriteFilter();
    if (favorite !== null) {
      result = result.filter((supplier) => supplier.isFavorite === favorite);
    }

    // Apply country filter
    const country = this.countryFilter();
    if (country) {
      result = result.filter((supplier) => supplier.country === country);
    }

    // Apply region filter
    const region = this.regionFilter();
    if (region) {
      result = result.filter((supplier) => supplier.region === region);
    }

    return result;
  });

  ngOnInit(): void {
    // Initialize filters from query params
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams['favorite'] !== undefined) {
      this.favoriteFilter.set(queryParams['favorite'] === 'true');
      this.filterForm.patchValue({
        favorite: queryParams['favorite'] === 'true',
      });
    }
    if (queryParams['country']) {
      this.countryFilter.set(queryParams['country']);
      this.filterForm.patchValue({ country: queryParams['country'] });
    }
    if (queryParams['region']) {
      this.regionFilter.set(queryParams['region']);
      this.filterForm.patchValue({ region: queryParams['region'] });
    }

    // Watch for search changes
    this.searchControl.valueChanges.subscribe(() => {
      // Search is handled by computed property
    });
  }

  toggleFavorite(supplier: Supplier): void {
    supplier.isFavorite = !supplier.isFavorite;
    // If filtering by favorites, update the filter
    if (this.favoriteFilter() !== null) {
      // Filter will automatically update via computed property
    }
  }

  // Sample reviews data
  sampleReviews: Review[] = [
    {
      pharmacyName: 'City Pharmacy',
      pharmacyImage:
        'https://blocks.astratic.com/img/general-img-landscape.png',
      rating: 5,
      comment:
        'Excellent supplier with reliable delivery and quality products. Highly recommended for pharmaceutical needs.',
      date: '2 weeks ago',
    },
    {
      pharmacyName: 'MediCare Plus',
      pharmacyImage:
        'https://blocks.astratic.com/img/general-img-landscape.png',
      rating: 4,
      comment:
        'Good pricing and customer service. Sometimes delivery can be delayed but overall satisfied with the partnership.',
      date: '1 month ago',
    },
    {
      pharmacyName: 'HealthFirst Pharmacy',
      pharmacyImage:
        'https://blocks.astratic.com/img/general-img-landscape.png',
      rating: 5,
      comment:
        'Top-notch quality and professional service. They understand our needs and always deliver on time. Best supplier we have worked with.',
      date: '2 months ago',
    },
  ];

  openFilterModal(): void {
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
  }

  onFavoriteFilterChange(value: string | number | null): void {
    if (value === null) {
      this.filterForm.patchValue({ favorite: null });
    } else {
      this.filterForm.patchValue({ favorite: value === 'true' });
    }
  }

  onCountryFilterChange(value: string | number | null): void {
    this.filterForm.patchValue({ country: value as string | null });
  }

  onRegionFilterChange(value: string | number | null): void {
    this.filterForm.patchValue({ region: value as string | null });
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    const queryParams: any = { ...this.route.snapshot.queryParams };

    // Update filters
    if (formValue.favorite !== null && formValue.favorite !== undefined) {
      this.favoriteFilter.set(formValue.favorite);
      queryParams['favorite'] = formValue.favorite;
    } else {
      this.favoriteFilter.set(null);
      delete queryParams['favorite'];
    }

    if (formValue.country) {
      this.countryFilter.set(formValue.country);
      queryParams['country'] = formValue.country;
    } else {
      this.countryFilter.set(null);
      delete queryParams['country'];
    }

    if (formValue.region) {
      this.regionFilter.set(formValue.region);
      queryParams['region'] = formValue.region;
    } else {
      this.regionFilter.set(null);
      delete queryParams['region'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });

    this.closeFilterModal();
  }

  clearAllFilters(): void {
    this.searchControl.setValue('');
    this.favoriteFilter.set(null);
    this.countryFilter.set(null);
    this.regionFilter.set(null);
    this.filterForm.patchValue({
      favorite: null,
      country: null,
      region: null,
      regionSearch: '',
      countrySearch: '',
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  get hasActiveFilters(): boolean {
    const queryParams = this.route.snapshot.queryParams;
    return !!(
      queryParams['favorite'] ||
      queryParams['country'] ||
      queryParams['region']
    );
  }

  filterModalPrimaryAction = {
    label: 'Apply Filters',
    variant: 'primary' as const,
    action: () => this.applyFilters(),
  };

  filterModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeFilterModal(),
  };

  openViewModal(supplier: Supplier): void {
    this.viewingSupplier = supplier;
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.viewingSupplier = null;
  }

  buyFromSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers', supplier.id, 'products']);
  }

  get viewModalPrimaryAction() {
    return {
      label: 'Buy From',
      variant: 'primary' as const,
      action: () => {
        if (this.viewingSupplier) {
          this.buyFromSupplier(this.viewingSupplier);
        }
      },
      icon: this.icons.ShoppingCart,
    };
  }

  viewModalSecondaryAction = {
    label: 'Close',
    variant: 'secondary' as const,
    action: () => this.closeViewModal(),
  };
}
