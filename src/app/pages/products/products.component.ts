import { Component, signal, inject, OnInit, ViewChild } from '@angular/core';
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
import { SelectOption } from '../../components/select/select.component';
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
import { FormBuilder } from '@angular/forms';
import { SAMPLE_STOCK } from '../../constants/stock.constants';
import { AddProductFormComponent } from '../../components/add-product-form/add-product-form.component';
import { ProductsModalsComponent } from '../../components/products-modals/products-modals.component';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    ExportSelectComponent,
    PopupComponent,
    DataTableComponent,
    AddProductFormComponent,
    ProductsModalsComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  @ViewChild(AddProductFormComponent)
  addProductFormComponent?: AddProductFormComponent;

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
    dosageForm: new FormControl<string | null>(null),
    strength: new FormControl<number | null>(null),
    unit: new FormControl<string>('mg', { nonNullable: true }),
    brand: new FormControl<string>('', { nonNullable: true }),
    stockThreshold: new FormControl<number | null>(null),
    costPrice: new FormControl<number | null>(null),
    sellingPrice: new FormControl<number | null>(null),
    discountValue: new FormControl<number | null>(null),
    supplierName: new FormControl<string>('', { nonNullable: true }),
    supplierContact: new FormControl<string>('', { nonNullable: true }),
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
    shelve: new FormControl<string | null>(null),
    shelveSearch: new FormControl<string>(''),
    drugClass: new FormControl<string>('', { nonNullable: true }),
    quantity: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    strength: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    unit: new FormControl<string>('mg', { nonNullable: true }),
    expiryDate: new FormControl<string>(''),
    brand: new FormControl<string>(''),
    dosageForm: new FormControl<string>(''),
    stockThreshold: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    costPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    cashPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    creditPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    wholesalePrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    trekPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    discountType: new FormControl<'flat' | 'percentage'>('percentage', {
      validators: [Validators.required],
    }),
    discount: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    supplierName: new FormControl<string | null>(null),
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

  // Discount type options
  discountTypeOptions: SelectOption[] = [
    { id: 'percentage', name: 'Percentage (%)' },
    { id: 'flat', name: 'Flat (GHS)' },
  ];

  // Shelve options
  shelveOptions: SelectOption[] = [
    { id: 'AMA', name: 'AMA' },
    { id: 'BMB', name: 'BMB' },
    { id: 'CMC', name: 'CMC' },
    { id: 'DMD', name: 'DMD' },
    { id: 'EME', name: 'EME' },
    { id: 'FMF', name: 'FMF' },
  ];

  // Supplier options
  supplierOptions: SelectOption[] = [
    { id: 'Johnson & Johnson', name: 'Johnson & Johnson' },
    { id: 'Tobinco Pharmaceuticals', name: 'Tobinco Pharmaceuticals' },
    { id: 'Pfizer', name: 'Pfizer' },
    { id: 'GlaxoSmithKline', name: 'GlaxoSmithKline' },
  ];

  // Local state for selects
  selectedDrugClass: string | number | null = '';
  selectedDosageForm: string | number | null = '';
  selectedUnit: string | number | null = 'mg';
  selectedShelve: string | number | null = null;
  selectedSupplierName: string | number | null = null;

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

  productNameOptions: SelectOption[] = [];

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

    // Create product name options from stock items (unique product names)
    const stockProductNames = [
      ...new Set(SAMPLE_STOCK.map((s) => s.productName)),
    ];
    this.productNameOptions = stockProductNames.map((name) => ({
      id: name,
      name: name,
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

  onProductFormSubmit(value: any): void {
    console.log('Add Product payload:', value);
    this.isAddOpen = false;
    // Handle the form submission (e.g., add to products list, call API, etc.)
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
        dosageForm: (product as any).dosageForm || null,
        strength: (product as any).strength || null,
        unit: (product as any).unit || 'mg',
        brand: (product as any).brand || '',
        stockThreshold: (product as any).stockThreshold || null,
        costPrice: (product as any).costPrice || null,
        sellingPrice: (product as any).sellingPrice || null,
        discountValue: (product as any).discountValue || null,
        supplierName: (product as any).supplierName || '',
        supplierContact: (product as any).supplierContact || '',
      });
      // Set selected values for selects
      this.selectedShelve = product.stock || null;
      this.selectedDrugClass = product.category || '';
      this.selectedDosageForm = (product as any).dosageForm || '';
      this.selectedUnit = (product as any).unit || 'mg';
      this.selectedSupplierName = (product as any).supplierName || null;
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
        dosageForm: (this.viewingProduct as any).dosageForm || null,
        strength: (this.viewingProduct as any).strength || null,
        unit: (this.viewingProduct as any).unit || 'mg',
        brand: (this.viewingProduct as any).brand || '',
        stockThreshold: (this.viewingProduct as any).stockThreshold || null,
        costPrice: (this.viewingProduct as any).costPrice || null,
        sellingPrice: (this.viewingProduct as any).sellingPrice || null,
        discountValue: (this.viewingProduct as any).discountValue || null,
        supplierName: (this.viewingProduct as any).supplierName || '',
        supplierContact: (this.viewingProduct as any).supplierContact || '',
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
      (product as any).dosageForm = formValue.dosageForm || null;
      (product as any).strength = formValue.strength || null;
      (product as any).unit = formValue.unit || 'mg';
      (product as any).brand = formValue.brand || '';
      (product as any).stockThreshold = formValue.stockThreshold || null;
      (product as any).costPrice = formValue.costPrice || null;
      (product as any).sellingPrice = formValue.sellingPrice || null;
      (product as any).discountValue = formValue.discountValue || null;
      (product as any).supplierName = formValue.supplierName || '';
      (product as any).supplierContact = formValue.supplierContact || '';
    }

    this.isEditMode.set(false);
    // Update viewingProduct to reflect changes
    if (this.viewingProduct) {
      this.viewingProduct = { ...this.viewingProduct, ...product };
    }
  }

  onProductNameChange(value: string | number | null): void {
    const nameValue = (value ?? '').toString();
    this.editProductForm.patchValue({ name: nameValue });
  }

  onCategoryChangeInEdit(value: string | number | null): void {
    this.editProductForm.patchValue({ category: value as string | null });
  }

  onBranchChangeInEdit(value: string | number | null): void {
    this.editProductForm.patchValue({ branch: value as string | null });
  }

  onDosageFormChangeInEdit(value: string | number | null): void {
    this.editProductForm.patchValue({ dosageForm: value as string | null });
    this.selectedDosageForm = value;
  }

  onUnitChangeInEdit(value: string | number | null): void {
    this.editProductForm.patchValue({ unit: (value as string) || 'mg' });
    this.selectedUnit = value;
  }

  onShelveChangeInEdit(value: string | number | null): void {
    this.editProductForm.patchValue({ stock: (value as string) || '' });
    this.selectedShelve = value;
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

  get deleteModalDescription(): string {
    if (this.productToDelete) {
      return `Are you sure you want to delete the product "${this.productToDelete.name}"? This action cannot be undone.`;
    }
    return '';
  }

  isAddOpen = false;

  addDrugPrimaryAction = {
    label: 'Save',
    variant: 'primary' as const,
    action: () => {
      this.addProductFormComponent?.submitForm();
    },
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

  onShelveChange(value: string | number | null): void {
    console.log('Shelve changed to:', value);
    this.selectedShelve = value;
    this.addDrugForm.patchValue({ shelve: (value as string) || null });
  }

  onDiscountTypeChange(value: string | number | null): void {
    this.addDrugForm.patchValue({
      discountType: value as 'flat' | 'percentage',
    });
  }

  onSupplierNameChange(value: string | number | null): void {
    this.selectedSupplierName = value;
    const supplierValue = (value ?? '').toString();
    this.addDrugForm.patchValue({ supplierName: value as string | null });
    this.editProductForm.patchValue({ supplierName: supplierValue });
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
        label: 'Product Class',
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
