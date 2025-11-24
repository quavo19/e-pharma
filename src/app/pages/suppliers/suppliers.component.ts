import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
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
  Plus,
  Edit,
  Trash2,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { FormBuilder } from '@angular/forms';
import { GHANA_REGIONS } from '../../constants/regions';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import {
  ActionMenuItem,
} from '../../components/action-menu/action-menu.component';
import { DataTableComponent, TableColumn } from '../../components/data-table/data-table.component';

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
    ConfirmationModalComponent,
    DataTableComponent,
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
  isAddModalOpen = signal(false);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isViewEditMode = signal(false);
  viewingSupplier: Supplier | null = null;
  editingSupplier: Supplier | null = null;
  deletingSupplier: Supplier | null = null;
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

  supplierForm = this.fb.group({
    name: new FormControl('', [Validators.required]),
    region: new FormControl<string>('', [Validators.required]),
    country: new FormControl<string>('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
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
    Plus,
    Edit,
    Trash2,
  };

  // Sample suppliers data - using signal for reactivity
  suppliers = signal<Supplier[]>([
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
  ]);

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
    let result = [...this.suppliers()];

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
    this.isViewEditMode.set(false);
    // Reset form with supplier data
    this.supplierForm.patchValue({
      name: supplier.name,
      region: supplier.region,
      country: supplier.country,
      email: supplier.email || '',
      phone: supplier.contact || '',
    });
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.isViewEditMode.set(false);
    this.viewingSupplier = null;
    this.supplierForm.reset();
  }

  enableViewEditMode(): void {
    this.isViewEditMode.set(true);
  }

  cancelViewEdit(): void {
    if (this.viewingSupplier) {
      this.supplierForm.patchValue({
        name: this.viewingSupplier.name,
        region: this.viewingSupplier.region,
        country: this.viewingSupplier.country,
        email: this.viewingSupplier.email || '',
        phone: this.viewingSupplier.contact || '',
      });
    }
    this.isViewEditMode.set(false);
  }

  saveViewEdit(): void {
    if (this.supplierForm.valid && this.viewingSupplier) {
      const formValue = this.supplierForm.value;
      this.suppliers.update((current) =>
        current.map((supplier) =>
          supplier.id === this.viewingSupplier!.id
            ? {
                ...supplier,
                name: formValue.name || '',
                region: formValue.region || '',
                country: formValue.country || '',
                email: formValue.email || '',
                contact: formValue.phone || '',
              }
            : supplier
        )
      );
      // Update viewing supplier to reflect changes
      this.viewingSupplier = {
        ...this.viewingSupplier,
        name: formValue.name || '',
        region: formValue.region || '',
        country: formValue.country || '',
        email: formValue.email || '',
        contact: formValue.phone || '',
      };
      this.isViewEditMode.set(false);
    }
  }

  buyFromSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers', supplier.id, 'stock']);
  }

  get viewModalPrimaryAction() {
    if (this.isViewEditMode()) {
      return {
        label: 'Save Changes',
        variant: 'primary' as const,
        action: () => this.saveViewEdit(),
        disabled: !this.supplierForm.valid,
      };
    }
    return null;
  }

  get viewModalSecondaryAction() {
    if (this.isViewEditMode()) {
      return {
        label: 'Cancel',
        variant: 'secondary' as const,
        action: () => this.cancelViewEdit(),
      };
    }
    return {
      label: 'Edit',
      variant: 'secondary' as const,
      action: () => this.enableViewEditMode(),
    };
  }

  // Add Supplier Methods
  openAddModal(): void {
    this.supplierForm.reset();
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
    this.supplierForm.reset();
  }

  onAddSupplier(): void {
    if (this.supplierForm.valid) {
      const formValue = this.supplierForm.value;
      const newSupplier: Supplier = {
        id: `SUP${String(this.suppliers().length + 1).padStart(3, '0')}`,
        name: formValue.name || '',
        region: formValue.region || '',
        country: formValue.country || '',
        email: formValue.email || '',
        contact: formValue.phone || '',
        logo: 'https://blocks.astratic.com/img/general-img-landscape.png',
        isFavorite: false,
        rating: 0,
        reviewCount: 0,
      };
      this.suppliers.update((current) => [...current, newSupplier]);
      this.closeAddModal();
    }
  }

  get addModalPrimaryAction() {
    return {
      label: 'Add Supplier',
      variant: 'primary' as const,
      action: () => this.onAddSupplier(),
      disabled: !this.supplierForm.valid,
    };
  }

  addModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeAddModal(),
  };

  // Edit Supplier Methods
  openEditModal(supplier: Supplier): void {
    this.editingSupplier = supplier;
    this.supplierForm.patchValue({
      name: supplier.name,
      region: supplier.region,
      country: supplier.country,
      email: supplier.email || '',
      phone: supplier.contact || '',
    });
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.editingSupplier = null;
    this.supplierForm.reset();
  }

  onEditSupplier(): void {
    if (this.supplierForm.valid && this.editingSupplier) {
      const formValue = this.supplierForm.value;
      this.suppliers.update((current) =>
        current.map((supplier) =>
          supplier.id === this.editingSupplier!.id
            ? {
                ...supplier,
                name: formValue.name || '',
                region: formValue.region || '',
                country: formValue.country || '',
                email: formValue.email || '',
                contact: formValue.phone || '',
              }
            : supplier
        )
      );
      this.closeEditModal();
    }
  }

  get editModalPrimaryAction() {
    return {
      label: 'Save Changes',
      variant: 'primary' as const,
      action: () => this.onEditSupplier(),
      disabled: !this.supplierForm.valid,
    };
  }

  editModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeEditModal(),
  };

  // Delete Supplier Methods
  openDeleteModal(supplier: Supplier): void {
    this.deletingSupplier = supplier;
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deletingSupplier = null;
  }

  onDeleteSupplier(): void {
    if (this.deletingSupplier) {
      this.suppliers.update((current) =>
        current.filter((supplier) => supplier.id !== this.deletingSupplier!.id)
      );
      this.closeDeleteModal();
    }
  }

  get deleteModalPrimaryAction() {
    return {
      label: 'Delete',
      variant: 'danger' as const,
      action: () => this.onDeleteSupplier(),
    };
  }

  deleteModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeDeleteModal(),
  };

  // Form change handlers for select components
  onRegionFormChange(value: string | number | null): void {
    this.supplierForm.patchValue({ region: value as string });
  }

  onCountryFormChange(value: string | number | null): void {
    this.supplierForm.patchValue({ country: value as string });
  }

  // Table columns configuration
  tableColumns = signal<TableColumn<Supplier>[]>([
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'region',
      label: 'Region',
    },
    {
      key: 'country',
      label: 'Country',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'contact',
      label: 'Phone',
    },
  ]);

  // Format data for display
  getFormattedSuppliers = (): any[] => {
    return this.filteredSuppliers().map((supplier) => ({
      ...supplier,
      email: supplier.email || 'N/A',
      contact: supplier.contact || 'N/A',
    }));
  };

  // Action menu items for each supplier
  getMenuItems = (supplier: Supplier, index: number): ActionMenuItem[] => {
    return [
      {
        label: 'View',
        action: () => this.openViewModal(supplier),
        icon: this.icons.Eye,
      },
      {
        label: 'Edit',
        action: () => this.openEditModal(supplier),
        icon: this.icons.Edit,
      },
      {
        label: 'Delete',
        action: () => this.openDeleteModal(supplier),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  // Row click handler - navigate to supplier stock page
  onRowClick = (supplier: Supplier, index: number): void => {
    this.buyFromSupplier(supplier);
  };
}
