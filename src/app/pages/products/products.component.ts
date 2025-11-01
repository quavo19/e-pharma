import { Component, signal, inject, OnInit } from '@angular/core';
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
  Plus,
  Download,
  XCircle,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { ExportSelectComponent } from '../../components/export-select/export-select.component';
import { PopupComponent } from '../../components/popup/popup.component';
import {
  ActionMenuComponent,
  ActionMenuItem,
} from '../../components/action-menu/action-menu.component';
import {
  TableHeaderDropdownComponent,
  TableHeaderDropdownOption,
} from '../../components/table-header-dropdown/table-header-dropdown.component';
import {
  DataTableComponent,
  TableColumn,
} from '../../components/data-table/data-table.component';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    SelectComponent,
    ExportSelectComponent,
    PopupComponent,
    DataTableComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchControl = new FormControl('');

  // Add Drug form
  addDrugForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    shelve: new FormControl<string>('', { nonNullable: true }),
    drugClass: new FormControl<string>('', { nonNullable: true }),
    quantity: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    strength: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    unit: new FormControl<string>('mg', { nonNullable: true }),
    createdBy: new FormControl<string>(''),
    expiryDate: new FormControl<string>(''),
    brand: new FormControl<string>(''),
    dosageForm: new FormControl<string>(''),
    stockThreshold: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    costPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    sellingPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    discountValue: new FormControl<number | null>(null, {
      validators: [Validators.min(0), Validators.max(100)],
    }),
    supplierName: new FormControl<string>(''),
    supplierContact: new FormControl<string>(''),
  });

  // Select options for dropdowns
  drugClassOptions: SelectOption[] = [
    { id: 'Pain Killer', name: 'Pain Killer' },
    { id: 'Antibiotic', name: 'Antibiotic' },
    { id: 'Antipyretic', name: 'Antipyretic' },
    { id: 'Antimalarial', name: 'Antimalarial' },
  ];

  dosageFormOptions: SelectOption[] = [
    { id: 'tablet', name: 'Tablet' },
    { id: 'capsule', name: 'Capsule' },
    { id: 'syrup', name: 'Syrup' },
    { id: 'injection', name: 'Injection' },
    { id: 'ointment', name: 'Ointment' },
  ];

  unitOptions: SelectOption[] = [
    { id: 'mg', name: 'mg' },
    { id: 'g', name: 'g' },
    { id: 'mcg', name: 'mcg' },
    { id: 'ml', name: 'ml' },
  ];

  // Local state for selects
  selectedDrugClass: string | number | null = '';
  selectedDosageForm: string | number | null = '';
  selectedUnit: string | number | null = 'mg';

  public readonly icons = {
    Search,
    Plus,
    Download,
    XCircle,
  };

  products = [
    {
      id: 'P001',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      stock: 'Available',
      quantity: 150,
      status: 'Active',
      expiryDate: '2026-03-15',
      inputtedBy: 'Alice Johnson',
      facility: 'main',
    },
    {
      id: 'P002',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      stock: 'Low Stock',
      quantity: 8,
      status: 'Active',
      expiryDate: '2025-12-01',
      inputtedBy: 'Michael Smith',
      facility: 'east',
    },
    {
      id: 'P003',
      name: 'Vitamin C 1000mg',
      category: 'Vitamins',
      stock: 'Out of Stock',
      quantity: 0,
      status: 'Inactive',
      expiryDate: '2025-08-30',
      inputtedBy: 'Grace Lee',
      facility: 'west',
    },
    {
      id: 'P004',
      name: 'Ibuprofen 400mg',
      category: 'Pain Relief',
      stock: 'Available',
      quantity: 75,
      status: 'Active',
      expiryDate: '2027-01-20',
      inputtedBy: 'David Kim',
      facility: 'main',
    },
    {
      id: 'P005',
      name: 'Multivitamin',
      category: 'Vitamins',
      stock: 'Available',
      quantity: 200,
      status: 'Active',
      expiryDate: '2026-09-10',
      inputtedBy: 'Sara Ahmed',
      facility: 'north',
    },
  ];

  // Dropdown options for table headers
  nameSortOptions: TableHeaderDropdownOption[] = [
    { id: 'asc', label: 'Ascending' },
    { id: 'desc', label: 'Descending' },
  ];

  expiryDateSortOptions: TableHeaderDropdownOption[] = [
    { id: 'asc', label: 'Ascending' },
    { id: 'desc', label: 'Descending' },
  ];

  inputtedBySortOptions: TableHeaderDropdownOption[] = [
    { id: 'asc', label: 'Ascending' },
    { id: 'desc', label: 'Descending' },
  ];

  categoryOptions: TableHeaderDropdownOption[] = [];

  facilityOptions: TableHeaderDropdownOption[] = [
    { id: 'main', label: 'Main Facility' },
    { id: 'east', label: 'East Wing' },
    { id: 'west', label: 'West Wing' },
    { id: 'north', label: 'North Wing' },
  ];

  ngOnInit(): void {
    // Extract unique categories from products
    const categories = [...new Set(this.products.map((p) => p.category))];
    this.categoryOptions = categories.map((cat) => ({
      id: cat,
      label: cat,
    }));
  }

  get filteredProducts() {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    const queryParams = this.route.snapshot.queryParams;

    let filtered = [...this.products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.id.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter from URL
    if (queryParams['category']) {
      filtered = filtered.filter((p) => p.category === queryParams['category']);
    }

    // Apply facility filter from URL
    if (queryParams['facility']) {
      filtered = filtered.filter((p) => p.facility === queryParams['facility']);
    }

    // Apply sorting from URL
    if (queryParams['nameSort']) {
      filtered.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (queryParams['nameSort'] === 'asc') {
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        } else {
          return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
        }
      });
    }

    if (queryParams['expiryDateSort']) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.expiryDate).getTime();
        const dateB = new Date(b.expiryDate).getTime();
        return queryParams['expiryDateSort'] === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      });
    }

    if (queryParams['inputtedBySort']) {
      filtered.sort((a, b) => {
        const nameA = a.inputtedBy.toLowerCase();
        const nameB = b.inputtedBy.toLowerCase();
        if (queryParams['inputtedBySort'] === 'asc') {
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        } else {
          return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
        }
      });
    }

    // Map facility IDs to labels for display
    return filtered.map((p) => ({
      ...p,
      facilityLabel: this.getFacilityLabel(p.facility),
    }));
  }

  onAddProduct(): void {
    this.isAddOpen = true;
  }

  onSubmitAddDrug(): void {
    if (this.addDrugForm.invalid) {
      this.addDrugForm.markAllAsTouched();
      return;
    }
    const value = this.addDrugForm.getRawValue();
    console.log('Add Drug payload:', value);
    this.isAddOpen = false;
    this.addDrugForm.reset({ unit: 'mg' });
  }

  onExport(): void {
    console.log('Export clicked');
  }

  exportOptions: SelectOption[] = [
    { id: 'pdf', name: 'PDF' },
    { id: 'excel', name: 'Excel' },
  ];

  onExportTypeChange(value: string | number | null): void {
    if (value === 'pdf') {
      console.log('Export as PDF');
    } else if (value === 'excel') {
      console.log('Export as Excel');
    }
  }

  onViewProduct(productId: string): void {
    console.log('View product:', productId);
  }

  onEditProduct(productId: string): void {
    console.log('Edit', productId);
  }

  onDeleteProduct(productId: string): void {
    console.log('Delete', productId);
  }

  get hasActiveFilters(): boolean {
    const queryParams = this.route.snapshot.queryParams;
    const filterKeys = [
      'nameSort',
      'expiryDateSort',
      'inputtedBySort',
      'category',
      'facility',
    ];
    return filterKeys.some((key) => queryParams[key]);
  }

  clearAllFilters(): void {
    const paramsToRemove = [
      'nameSort',
      'expiryDateSort',
      'inputtedBySort',
      'category',
      'facility',
    ];
    const currentParams = { ...this.route.snapshot.queryParams };

    paramsToRemove.forEach((key) => {
      delete currentParams[key];
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
    });
  }

  isAddOpen = false;

  addDrugPrimaryAction = {
    label: 'Save',
    variant: 'primary' as const,
    action: () => this.onSubmitAddDrug(),
  };

  addDrugSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeAdd(),
  };

  closeAdd(): void {
    this.isAddOpen = false;
  }

  // Select change handlers to sync with form
  onDrugClassChange(value: string | number | null): void {
    this.selectedDrugClass = value;
    this.addDrugForm.patchValue({ drugClass: (value ?? '').toString() });
  }

  onDosageFormChange(value: string | number | null): void {
    this.selectedDosageForm = value;
    this.addDrugForm.patchValue({ dosageForm: (value ?? '').toString() });
  }

  onUnitChange(value: string | number | null): void {
    this.selectedUnit = value;
    this.addDrugForm.patchValue({ unit: (value ?? '').toString() });
  }

  getMenuItems(product: { id: string }): ActionMenuItem[] {
    return [
      {
        label: 'Edit',
        action: () => this.onEditProduct(product.id),
      },
      {
        label: 'View',
        action: () => this.onViewProduct(product.id),
      },
      {
        label: 'Delete',
        action: () => this.onDeleteProduct(product.id),
        variant: 'danger',
      },
    ];
  }

  getFacilityLabel(facilityId: string): string {
    const facility = this.facilityOptions.find((f) => f.id === facilityId);
    return facility?.label || facilityId;
  }

  // Table columns configuration
  get tableColumns(): TableColumn[] {
    return [
      {
        key: 'name',
        label: 'Product Name',
        headerDropdown: {
          options: this.nameSortOptions,
          queryParamKey: 'nameSort',
          clearLabel: 'Clear Sort',
        },
      },
      {
        key: 'category',
        label: 'Category',
        headerDropdown: {
          options: this.categoryOptions,
          queryParamKey: 'category',
          clearLabel: 'Clear Filter',
        },
      },
      {
        key: 'stock',
        label: 'Stock',
      },
      {
        key: 'quantity',
        label: 'Quantity',
      },
      {
        key: 'expiryDate',
        label: 'Expiry Date',
        headerDropdown: {
          options: this.expiryDateSortOptions,
          queryParamKey: 'expiryDateSort',
          clearLabel: 'Clear Sort',
        },
      },
      {
        key: 'inputtedBy',
        label: 'Inputted By',
        headerDropdown: {
          options: this.inputtedBySortOptions,
          queryParamKey: 'inputtedBySort',
          clearLabel: 'Clear Sort',
        },
      },
      {
        key: 'facilityLabel',
        label: 'Facility',
        headerDropdown: {
          options: this.facilityOptions,
          queryParamKey: 'facility',
          clearLabel: 'Clear Filter',
          enableSearch: true,
          dropdownWidth: 'min-w-[150px]',
        },
      },
    ];
  }
}
