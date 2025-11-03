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
  SlidersHorizontal,
  Eye,
  Trash2,
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
  DataTableComponent,
  TableColumn,
} from '../../components/data-table/data-table.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { FormBuilder } from '@angular/forms';

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
    ConfirmationModalComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isViewProductModalOpen = signal(false);
  isEditMode = signal(false);
  viewingProduct: any = null;
  productToDelete: any = null;

  editProductForm = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true }),
    category: new FormControl<string | null>(null),
    stock: new FormControl<string>('', { nonNullable: true }),
    quantity: new FormControl<number | null>(null),
    expiryDate: new FormControl<string>('', { nonNullable: true }),
    branch: new FormControl<string | null>(null),
  });

  filterForm = this.fb.group({
    category: new FormControl<string>(''),
    categorySearch: new FormControl<string>(''),
    expiryDateSort: new FormControl<string | null>(null),
    branch: new FormControl<string | null>(null),
    branchSearch: new FormControl<string>(''),
  });

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
    SlidersHorizontal,
    Eye,
    Trash2,
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

  // Filter options for filter modal
  expiryDateSortOptions: SelectOption[] = [
    { id: 'asc', name: 'Ascending' },
    { id: 'desc', name: 'Descending' },
  ];

  categoryOptions: SelectOption[] = [];

  branchOptions: SelectOption[] = [
    { id: 'main', name: 'Main Facility' },
    { id: 'east', name: 'East Wing' },
    { id: 'west', name: 'West Wing' },
    { id: 'north', name: 'North Wing' },
  ];

  ngOnInit(): void {
    // Extract unique categories from products
    const categories = [...new Set(this.products.map((p) => p.category))];
    this.categoryOptions = categories.map((cat) => ({
      id: cat,
      name: cat,
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

    // Apply branch filter from URL
    if (queryParams['branch']) {
      filtered = filtered.filter((p) => p.facility === queryParams['branch']);
    }

    // Apply sorting from URL
    if (queryParams['expiryDateSort']) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.expiryDate).getTime();
        const dateB = new Date(b.expiryDate).getTime();
        return queryParams['expiryDateSort'] === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      });
    }

    // Map branch IDs to labels for display
    return filtered.map((p) => ({
      ...p,
      branchLabel: this.getBranchLabel(p.facility),
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
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      this.viewingProduct = product;
      this.isEditMode.set(false);
      this.editProductForm.patchValue({
        name: product.name,
        category: product.category,
        stock: product.stock,
        quantity: product.quantity,
        expiryDate: product.expiryDate,
        branch: product.facility,
      });
      this.isViewProductModalOpen.set(true);
    }
  }

  closeViewProductModal(): void {
    this.isViewProductModalOpen.set(false);
    this.isEditMode.set(false);
    this.viewingProduct = null;
    this.editProductForm.reset();
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    if (this.viewingProduct) {
      // Reset form to original values
      this.editProductForm.patchValue({
        name: this.viewingProduct.name,
        category: this.viewingProduct.category,
        stock: this.viewingProduct.stock,
        quantity: this.viewingProduct.quantity,
        expiryDate: this.viewingProduct.expiryDate,
        branch: this.viewingProduct.facility,
      });
    }
    this.isEditMode.set(false);
  }

  saveProductChanges(): void {
    if (this.editProductForm.invalid || !this.viewingProduct) {
      return;
    }

    const formValue = this.editProductForm.value;
    const product = this.products.find((p) => p.id === this.viewingProduct.id);
    if (product) {
      product.name = formValue.name || '';
      product.category = formValue.category || '';
      product.stock = formValue.stock || '';
      product.quantity = formValue.quantity || 0;
      product.expiryDate = formValue.expiryDate || '';
      product.facility = formValue.branch || '';
    }

    this.isEditMode.set(false);
    // Update viewingProduct to reflect changes
    if (this.viewingProduct) {
      this.viewingProduct = { ...this.viewingProduct, ...product };
    }
  }

  onCategoryChangeInEdit(value: string | number | null): void {
    this.editProductForm.patchValue({ category: value as string | null });
  }

  onBranchChangeInEdit(value: string | number | null): void {
    this.editProductForm.patchValue({ branch: value as string | null });
  }

  onDeleteProduct(productId: string): void {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      this.productToDelete = product;
      this.isDeleteModalOpen.set(true);
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      const index = this.products.findIndex(
        (p) => p.id === this.productToDelete.id
      );
      if (index !== -1) {
        this.products.splice(index, 1);
      }
    }
    this.closeDeleteModal();
  }

  openFilterModal(): void {
    // Load current filter values from URL params
    const queryParams = this.route.snapshot.queryParams;
    this.filterForm.patchValue({
      category: queryParams['category'] || '',
      categorySearch: '',
      expiryDateSort: queryParams['expiryDateSort'] || null,
      branch: queryParams['branch'] || null,
      branchSearch: '',
    });
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
  }

  onCategoryChange(value: string | number | null): void {
    this.filterForm.patchValue({ category: value as string | null });
  }

  onExpiryDateSortChange(value: string | number | null): void {
    this.filterForm.patchValue({ expiryDateSort: value as string | null });
  }

  onBranchChange(value: string | number | null): void {
    this.filterForm.patchValue({ branch: value as string | null });
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    const queryParams: any = { ...this.route.snapshot.queryParams };

    // Update query params based on form values
    if (formValue.category) {
      queryParams['category'] = formValue.category;
    } else {
      delete queryParams['category'];
    }

    if (formValue.expiryDateSort) {
      queryParams['expiryDateSort'] = formValue.expiryDateSort;
    } else {
      delete queryParams['expiryDateSort'];
    }

    if (formValue.branch) {
      queryParams['branch'] = formValue.branch;
    } else {
      delete queryParams['branch'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });

    this.closeFilterModal();
  }

  get hasActiveFilters(): boolean {
    const queryParams = this.route.snapshot.queryParams;
    const filterKeys = ['expiryDateSort', 'category', 'branch'];
    return filterKeys.some((key) => queryParams[key]);
  }

  clearAllFilters(): void {
    const paramsToRemove = ['expiryDateSort', 'category', 'branch'];
    const currentParams = { ...this.route.snapshot.queryParams };

    paramsToRemove.forEach((key) => {
      delete currentParams[key];
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
    });

    this.filterForm.reset();
  }

  get filterModalPrimaryAction() {
    return {
      label: 'Apply Filters',
      variant: 'primary' as const,
      action: () => this.applyFilters(),
    };
  }

  get filterModalSecondaryAction() {
    return {
      label: 'Cancel',
      variant: 'secondary' as const,
      action: () => this.closeFilterModal(),
    };
  }

  get deleteModalPrimaryAction() {
    return {
      label: 'Delete',
      variant: 'danger' as const,
      action: () => this.confirmDelete(),
    };
  }

  get deleteModalSecondaryAction() {
    return {
      label: 'Cancel',
      variant: 'secondary' as const,
      action: () => this.closeDeleteModal(),
    };
  }

  get deleteModalDescription(): string {
    if (this.productToDelete) {
      return `Are you sure you want to delete the product "${this.productToDelete.name}"? This action cannot be undone.`;
    }
    return '';
  }

  get viewProductModalPrimaryAction() {
    if (this.isEditMode()) {
      return {
        label: 'Save',
        variant: 'primary' as const,
        action: () => this.saveProductChanges(),
      };
    } else {
      return {
        label: 'Edit',
        variant: 'primary' as const,
        action: () => this.enterEditMode(),
      };
    }
  }

  get viewProductModalSecondaryAction() {
    if (this.isEditMode()) {
      return {
        label: 'Cancel',
        variant: 'secondary' as const,
        action: () => this.cancelEdit(),
      };
    } else {
      return {
        label: 'Close',
        variant: 'secondary' as const,
        action: () => this.closeViewProductModal(),
      };
    }
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

  getMenuItems = (product: { id: string }): ActionMenuItem[] => {
    return [
      {
        label: 'View',
        action: () => this.onViewProduct(product.id),
        icon: this.icons.Eye,
      },
      {
        label: 'Delete',
        action: () => this.onDeleteProduct(product.id),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  getBranchLabel(branchId: string): string {
    const branch = this.branchOptions.find((b) => b.id === branchId);
    return branch?.name || branchId;
  }

  // Table columns configuration
  get tableColumns(): TableColumn[] {
    return [
      {
        key: 'name',
        label: 'Product Name',
      },
      {
        key: 'category',
        label: 'Drug Class',
      },
      {
        key: 'stock',
        label: 'Shelve',
      },
      {
        key: 'quantity',
        label: 'Quantity',
      },
      {
        key: 'expiryDate',
        label: 'Expiry Date',
      },
      {
        key: 'inputtedBy',
        label: 'Inputted By',
      },
      {
        key: 'branchLabel',
        label: 'Branch',
      },
    ];
  }
}
