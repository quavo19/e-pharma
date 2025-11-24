import {
  Component,
  signal,
  inject,
  OnInit,
  computed,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  XCircle,
  SlidersHorizontal,
  Plus,
  Eye,
  Trash2,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ActionMenuItem } from '../../components/action-menu/action-menu.component';
import { Router } from '@angular/router';
import { SAMPLE_STOCK } from '../../constants/stock.constants';
import {
  DataTableComponent,
  TableColumn,
} from '../../components/data-table/data-table.component';

export interface Stock {
  id: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  weight: number;
  amount: number;
  discount: number;
  discountType: 'flat' | 'percentage';
  note?: string;
  dateCreated: Date;
  // Product form fields
  name?: string;
  drugClass?: string;
  category?: string;
  costPrice?: number;
  cashPrice?: number;
  creditPrice?: number;
  wholesalePrice?: number;
  trekPrice?: number;
  expiryDate?: string;
}

@Component({
  selector: 'app-stock',
  standalone: true,
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
  templateUrl: './stock.component.html',
})
export class StockComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  @ViewChild('productsTemplate') productsTemplate?: TemplateRef<any>;

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isAddModalOpen = signal(false);
  isViewModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  viewingStock: Stock | null = null;
  deletingStock: Stock | null = null;
  supplierFilter = signal<string | null>(null);

  stockForm = this.fb.group({
    productName: new FormControl<string>('', [Validators.required]),
    supplierId: new FormControl<string>('', [Validators.required]),
    quantity: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1),
    ]),
    weight: new FormControl<number>(0, [Validators.required]),
    amount: new FormControl<number>(0, [Validators.required]),
    discountType: new FormControl<'flat' | 'percentage'>('percentage', [
      Validators.required,
    ]),
    discount: new FormControl<number>(0, [Validators.required]),
    note: new FormControl('', []),
    supplierSearch: new FormControl<string>(''),
  });

  viewStockForm = this.fb.group({
    id: new FormControl('', []),
    productName: new FormControl('', []),
    supplierId: new FormControl<string>('', []),
    quantity: new FormControl<number>(0, []),
    weight: new FormControl<number>(0, []),
    amount: new FormControl<number>(0, []),
    discountType: new FormControl<'flat' | 'percentage'>('percentage', []),
    discount: new FormControl<number>(0, []),
    note: new FormControl('', []),
    dateCreated: new FormControl('', []),
  });

  filterForm = this.fb.group({
    supplier: new FormControl<string | null>(null),
    supplierSearch: new FormControl<string>(''),
  });

  // Import stock data from constants
  stock = signal<Stock[]>(SAMPLE_STOCK);

  // Table columns configuration
  tableColumns = signal<TableColumn<Stock>[]>([]);

  // Get suppliers from suppliers component (in real app, this would be a service)
  supplierOptions: SelectOption[] = [
    { id: 'SUP001', name: 'Johnson & Johnson' },
    { id: 'SUP002', name: 'Tobinco Pharmaceuticals' },
    { id: 'SUP003', name: 'Pfizer' },
    { id: 'SUP004', name: 'GlaxoSmithKline' },
  ];

  // Discount type options
  discountTypeOptions: SelectOption[] = [
    { id: 'percentage', name: 'Percentage (%)' },
    { id: 'flat', name: 'Flat (GHS)' },
  ];

  public readonly icons = {
    Search,
    XCircle,
    SlidersHorizontal,
    Plus,
    Eye,
    Trash2,
  };

  // Computed filtered stock
  filteredStock = computed(() => {
    let result = [...this.stock()];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchTerm) ||
          item.supplierName.toLowerCase().includes(searchTerm) ||
          item.id.toLowerCase().includes(searchTerm)
      );
    }

    // Apply supplier filter
    const supplier = this.supplierFilter();
    if (supplier) {
      result = result.filter((item) => item.supplierId === supplier);
    }

    return result;
  });

  ngOnInit(): void {
    // Initialize filters from query params if needed
  }

  ngAfterViewInit(): void {
    // Initialize table columns after view is initialized so template is available
    this.tableColumns.set([
      {
        key: 'products',
        label: 'Product',
        cellTemplate: this.productsTemplate,
      },
      {
        key: 'supplierName',
        label: 'Supplier',
      },
      {
        key: 'quantity',
        label: 'Quantity',
      },
      {
        key: 'amountDisplay',
        label: 'Amount',
      },
      {
        key: 'discountDisplay',
        label: 'Discount',
      },
      {
        key: 'dateCreatedDisplay',
        label: 'Date',
      },
    ]);
  }

  // Add Stock Methods
  openAddModal(): void {
    this.stockForm.reset();
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
    this.stockForm.reset();
  }

  onAddStock(): void {
    if (this.stockForm.valid) {
      const formValue = this.stockForm.value;
      const selectedSupplier = this.supplierOptions.find(
        (s) => s.id === formValue.supplierId
      );
      const newStock: Stock = {
        id: `STK${String(this.stock().length + 1).padStart(3, '0')}`,
        productName: formValue.productName || '',
        supplierId: formValue.supplierId || '',
        supplierName: selectedSupplier?.name || '',
        quantity: formValue.quantity || 0,
        weight: formValue.weight || 0,
        amount: formValue.amount || 0,
        discount: formValue.discount || 0,
        discountType: formValue.discountType || 'percentage',
        note: formValue.note || '',
        dateCreated: new Date(),
      };
      this.stock.update((current) => [...current, newStock]);
      this.closeAddModal();
    }
  }

  get addModalPrimaryAction() {
    return {
      label: 'Add Stock',
      variant: 'primary' as const,
      action: () => this.onAddStock(),
      disabled: !this.stockForm.valid,
    };
  }

  addModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeAddModal(),
  };

  // View Stock Methods
  openViewModal(stock: Stock): void {
    this.viewingStock = stock;
    // Populate view form with stock data
    this.viewStockForm.patchValue({
      id: stock.id,
      productName: stock.productName,
      supplierId: stock.supplierId,
      quantity: stock.quantity,
      weight: stock.weight,
      amount: stock.amount,
      discountType: stock.discountType,
      discount: stock.discount,
      note: stock.note || '',
      dateCreated: this.formatDate(stock.dateCreated),
    });
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.viewingStock = null;
    this.viewStockForm.reset();
  }

  // Delete Stock Methods
  openDeleteModal(stock: Stock): void {
    this.deletingStock = stock;
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deletingStock = null;
  }

  onDeleteStock(): void {
    if (this.deletingStock) {
      this.stock.update((current) =>
        current.filter((item) => item.id !== this.deletingStock!.id)
      );
      this.closeDeleteModal();
    }
  }

  get deleteModalPrimaryAction() {
    return {
      label: 'Delete',
      variant: 'danger' as const,
      action: () => this.onDeleteStock(),
    };
  }

  deleteModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeDeleteModal(),
  };

  get viewModalSecondaryAction() {
    return {
      label: 'Close',
      variant: 'secondary' as const,
      action: () => this.closeViewModal(),
    };
  }

  // Filter Methods
  openFilterModal(): void {
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
  }

  onSupplierFilterChange(value: string | number | null): void {
    this.filterForm.patchValue({ supplier: value as string | null });
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    this.supplierFilter.set(formValue.supplier || null);
    this.closeFilterModal();
  }

  clearAllFilters(): void {
    this.searchControl.setValue('');
    this.supplierFilter.set(null);
    this.filterForm.patchValue({
      supplier: null,
      supplierSearch: '',
    });
  }

  get hasActiveFilters(): boolean {
    return this.supplierFilter() !== null;
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

  // Format data for display
  getFormattedStock = (): any[] => {
    return this.filteredStock().map((item) => ({
      ...item,
      productsDisplay: item.productName, // For display with truncation
      weightDisplay: `${item.weight} kg`,
      amountDisplay: `GHS ${item.amount}`,
      discountDisplay:
        item.discountType === 'flat'
          ? `GHS ${item.discount}`
          : `${item.discount}%`,
      dateCreatedDisplay: this.formatDate(item.dateCreated),
    }));
  };

  // Action menu items
  getMenuItems = (stock: any, index: number): ActionMenuItem[] => {
    // Find the original stock item by ID
    const originalStock =
      this.filteredStock().find((s) => s.id === stock.id) || stock;
    return [
      {
        label: 'View',
        action: () => this.openViewModal(originalStock),
        icon: this.icons.Eye,
      },
      {
        label: 'Delete',
        action: () => this.openDeleteModal(originalStock),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  onSupplierFormChange(value: string | number | null): void {
    this.stockForm.patchValue({ supplierId: value as string });
  }

  onDiscountTypeChange(value: string | number | null): void {
    this.stockForm.patchValue({ discountType: value as 'flat' | 'percentage' });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
