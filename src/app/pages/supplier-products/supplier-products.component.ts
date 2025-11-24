import {
  Component,
  signal,
  inject,
  OnInit,
  computed,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  XCircle,
  SlidersHorizontal,
  ArrowLeft,
  Eye,
  Trash2,
  Plus,
  ShoppingCart,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { RouterLink } from '@angular/router';
import { Supplier } from '../suppliers/suppliers.component';
import { Stock } from '../stock/stock.component';
import { SAMPLE_STOCK } from '../../constants/stock.constants';
import {
  ActionMenuComponent,
  ActionMenuItem,
} from '../../components/action-menu/action-menu.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { AddProductFormComponent } from '../../components/add-product-form/add-product-form.component';

@Component({
  selector: 'app-supplier-products',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterLink,
    InputComponent,
    PopupComponent,
    ActionMenuComponent,
    ConfirmationModalComponent,
    AddProductFormComponent,
  ],
  templateUrl: './supplier-products.component.html',
})
export class SupplierProductsComponent implements OnInit {
  @ViewChild(AddProductFormComponent)
  addProductFormComponent?: AddProductFormComponent;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isViewProductModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isAddProductModalOpen = signal(false);
  viewingStock = signal<Stock | null>(null);
  deletingStock: Stock | null = null;
  supplierId: string | null = null;
  supplier = signal<Supplier | null>(null);

  // Filter stock by supplier
  stock = signal<Stock[]>([]);

  viewStockForm = this.fb.group({
    id: new FormControl('', []),
    name: new FormControl<string>('', []),
    shelve: new FormControl<string | null>(null),
    drugClass: new FormControl<string>('', []),
    dosageForm: new FormControl<string>('', []),
    quantity: new FormControl<number | null>(null),
    strength: new FormControl<number | null>(null),
    unit: new FormControl<string>('mg', []),
    expiryDate: new FormControl<string>('', []),
    brand: new FormControl<string>('', []),
    stockThreshold: new FormControl<number | null>(null),
    costPrice: new FormControl<number | null>(null),
    cashPrice: new FormControl<number | null>(null),
    creditPrice: new FormControl<number | null>(null),
    wholesalePrice: new FormControl<number | null>(null),
    trekPrice: new FormControl<number | null>(null),
    discountType: new FormControl<'flat' | 'percentage'>('percentage', []),
    discount: new FormControl<number | null>(null),
    supplierName: new FormControl<string | null>(null),
  });

  filterForm = this.fb.group({});

  public readonly icons = {
    Search,
    XCircle,
    SlidersHorizontal,
    ArrowLeft,
    Eye,
    Trash2,
    Plus,
    ShoppingCart,
  };

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id');

    // Load supplier data (in a real app, this would come from an API/service)
    // For now, we'll use sample supplier data based on common IDs
    if (this.supplierId) {
      const sampleSuppliers: Record<string, Supplier> = {
        SUP001: {
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
        SUP002: {
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
        SUP003: {
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
        SUP004: {
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
      };

      const foundSupplier = sampleSuppliers[this.supplierId];
      if (foundSupplier) {
        this.supplier.set(foundSupplier);
      } else {
        // Fallback for unknown supplier IDs
        this.supplier.set({
          id: this.supplierId,
          name: 'Supplier',
          logo: '/images/no-data.png',
          country: 'Ghana',
          region: 'Greater Accra',
          isFavorite: false,
          rating: 0,
          reviewCount: 0,
        });
      }

      // Filter stock by supplier
      const supplierStock = SAMPLE_STOCK.filter(
        (stock) => stock.supplierId === this.supplierId
      );
      this.stock.set(supplierStock);
    }
  }

  filteredStock = computed(() => {
    let result = [...this.stock()];
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();

    if (searchTerm) {
      result = result.filter(
        (item) =>
          (item['productName'] || item.productName)
            ?.toLowerCase()
            .includes(searchTerm) ||
          (item['id'] || item.id)?.toLowerCase().includes(searchTerm) ||
          (item['supplierName'] || item.supplierName)
            ?.toLowerCase()
            .includes(searchTerm)
      );
    }

    return result;
  });

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  onViewStock(stockItem: Stock | any): void {
    this.viewingStock.set(stockItem);
    // Populate form with stock data using form keys (matching product form structure)
    this.viewStockForm.patchValue({
      id: stockItem['id'] || stockItem.id,
      name:
        stockItem['name'] || stockItem['productName'] || stockItem.productName,
      shelve: stockItem['shelve'] || null,
      drugClass: stockItem['drugClass'] || stockItem['category'] || '',
      dosageForm: stockItem['dosageForm'] || '',
      quantity: stockItem['quantity'] || stockItem.quantity || null,
      strength: stockItem['strength'] || null,
      unit: stockItem['unit'] || 'mg',
      expiryDate: stockItem['expiryDate'] || '',
      brand: stockItem['brand'] || '',
      stockThreshold: stockItem['stockThreshold'] || null,
      costPrice: stockItem['costPrice'] || null,
      cashPrice: stockItem['cashPrice'] || null,
      creditPrice: stockItem['creditPrice'] || null,
      wholesalePrice: stockItem['wholesalePrice'] || null,
      trekPrice: stockItem['trekPrice'] || null,
      discountType:
        stockItem['discountType'] || stockItem.discountType || 'percentage',
      discount: stockItem['discount'] || stockItem.discount || null,
      supplierName: stockItem['supplierName'] || stockItem.supplierName || null,
    });
    this.isViewProductModalOpen.set(true);
  }

  getStockField(item: any, field: string, fallback?: any): any {
    return item[field] || fallback;
  }

  closeViewProductModal(): void {
    this.isViewProductModalOpen.set(false);
    this.viewingStock.set(null);
    this.viewStockForm.reset();
  }

  onDeleteStock(stockItem: Stock | any): void {
    this.deletingStock = stockItem;
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deletingStock = null;
  }

  confirmDeleteStock(): void {
    if (this.deletingStock) {
      this.stock.update((current) =>
        current.filter((item) => item.id !== this.deletingStock!.id)
      );
      this.closeDeleteModal();
    }
  }

  getMenuItems = (stockItem: Stock | any): ActionMenuItem[] => {
    return [
      {
        label: 'View',
        action: () => this.onViewStock(stockItem),
        icon: this.icons.Eye,
      },
      {
        label: 'Add to Products',
        action: () => this.onAddToProducts(stockItem),
        icon: this.icons.ShoppingCart,
      },
      {
        label: 'Delete',
        action: () => this.onDeleteStock(stockItem),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  onAddToProducts(stockItem: Stock | any): void {
    console.log('Add to Products - Stock ID:', stockItem.id);
  }

  openFilterModal(): void {
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
  }

  applyFilters(): void {
    this.closeFilterModal();
  }

  get hasActiveFilters(): boolean {
    return false; // No filters for now
  }

  clearAllFilters(): void {
    this.searchControl.setValue('');
  }

  get deleteModalPrimaryAction() {
    return {
      label: 'Delete',
      variant: 'danger' as const,
      action: () => this.confirmDeleteStock(),
    };
  }

  deleteModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeDeleteModal(),
  };

  viewModalSecondaryAction = {
    label: 'Close',
    variant: 'secondary' as const,
    action: () => this.closeViewProductModal(),
  };

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

  onAddProduct(): void {
    this.isAddProductModalOpen.set(true);
  }

  closeAddProductModal(): void {
    this.isAddProductModalOpen.set(false);
  }

  onProductFormSubmit(value: any): void {
    console.log('Add Product payload:', value);
    // Handle the form submission (e.g., add to stock list, call API, etc.)
    this.isAddProductModalOpen.set(false);
  }

  get addProductModalPrimaryAction() {
    return {
      label: 'Save',
      variant: 'primary' as const,
      action: () => {
        this.addProductFormComponent?.submitForm();
      },
    };
  }

  addProductModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeAddProductModal(),
  };
}
