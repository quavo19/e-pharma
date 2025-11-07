import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  XCircle,
  SlidersHorizontal,
  ShoppingCart,
  ArrowLeft,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Supplier } from '../suppliers/suppliers.component';
import {
  SAMPLE_PRODUCTS,
  BRANCH_OPTIONS,
  EXPIRY_DATE_SORT_OPTIONS,
  SupplierProduct,
} from './constants';
import { CartService } from './services/cart.service';
import { CartComponent } from './cart/cart.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { ViewProductComponent } from './view-product/view-product.component';

@Component({
  selector: 'app-supplier-products',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterLink,
    InputComponent,
    SelectComponent,
    PopupComponent,
    CartComponent,
    PlaceOrderComponent,
    ViewProductComponent,
  ],
  templateUrl: './supplier-products.component.html',
  providers: [CartService],
})
export class SupplierProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isViewProductModalOpen = signal(false);
  isCartModalOpen = signal(false);
  isPlaceOrderModalOpen = signal(false);
  viewingProduct = signal<SupplierProduct | null>(null);
  supplierId: string | null = null;
  supplier = signal<Supplier | null>(null);

  products = SAMPLE_PRODUCTS;
  expiryDateSortOptions = EXPIRY_DATE_SORT_OPTIONS;
  branchOptions = BRANCH_OPTIONS;
  categoryOptions: SelectOption[] = [];

  filterForm = this.fb.group({
    category: new FormControl<string>(''),
    categorySearch: new FormControl<string>(''),
    expiryDateSort: new FormControl<string | null>(null),
  });

  public readonly icons = {
    Search,
    XCircle,
    SlidersHorizontal,
    ShoppingCart,
    ArrowLeft,
  };

  // Computed values from cart service
  cartItemsArray = computed(() => this.cartService.getCartItemsArray());
  cartTotal = computed(() => this.cartService.getCartTotal());
  cartItemCount = computed(() => this.cartService.getCartItemCount());

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    this.cartService.loadCart(this.supplierId);

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
          rating: 4.5,
          reviewCount: 120,
        });
      }
    }

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

    // Format cost price for display
    return filtered.map((p) => ({
      ...p,
      costPriceDisplay: p.costPrice ? p.costPrice.toFixed(2) : 'N/A',
    }));
  }

  onViewProduct(productId: string): void {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      this.viewingProduct.set(product);
      this.isViewProductModalOpen.set(true);
    }
  }

  closeViewProductModal(): void {
    this.isViewProductModalOpen.set(false);
    this.viewingProduct.set(null);
  }

  onAddToCart(product: SupplierProduct): void {
    this.cartService.addToCart(product);
    this.cartService.saveCart(this.supplierId);
    if (this.isViewProductModalOpen()) {
      this.closeViewProductModal();
    }
  }

  onAddToCartFromTable(product: any): void {
    const productData = this.products.find((p) => p.id === product.id);
    if (productData) {
      this.onAddToCart(productData);
    }
  }

  isProductInCart(productId: string): boolean {
    return this.cartService.isProductInCart(productId);
  }

  onCartClick(): void {
    this.isCartModalOpen.set(true);
  }

  closeCartModal(): void {
    this.isCartModalOpen.set(false);
  }

  onIncreaseQuantity(productId: string): void {
    this.cartService.increaseQuantity(productId);
    this.cartService.saveCart(this.supplierId);
  }

  onDecreaseQuantity(productId: string): void {
    this.cartService.decreaseQuantity(productId);
    this.cartService.saveCart(this.supplierId);
  }

  onRemoveFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.cartService.saveCart(this.supplierId);
  }

  onProceedToPlaceOrder(): void {
    if (this.cartService.getCartItems().size === 0) {
      return;
    }
    this.closeCartModal();
    this.isPlaceOrderModalOpen.set(true);
  }

  closePlaceOrderModal(): void {
    this.isPlaceOrderModalOpen.set(false);
  }

  onPlaceOrder(orderData: {
    branch: string | number;
    contactNumber?: string;
    notes?: string;
  }): void {
    const orderPayload = {
      supplierId: this.supplierId,
      ...orderData,
      items: this.cartItemsArray().map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.costPrice,
        total: item.product.costPrice * item.quantity,
      })),
      total: this.cartTotal(),
      dateCreated: new Date().toISOString(),
    };

    console.log('Placing order:', orderPayload);

    // TODO: Send order to API

    // Clear cart after placing order
    this.cartService.clearCart();
    this.cartService.saveCart(this.supplierId);
    this.closePlaceOrderModal();

    // TODO: Show success message
  }

  openFilterModal(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.filterForm.patchValue({
      category: queryParams['category'] || '',
      categorySearch: '',
      expiryDateSort: queryParams['expiryDateSort'] || null,
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

  applyFilters(): void {
    const formValue = this.filterForm.value;
    const queryParams: any = { ...this.route.snapshot.queryParams };

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

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });

    this.closeFilterModal();
  }

  get hasActiveFilters(): boolean {
    const queryParams = this.route.snapshot.queryParams;
    const filterKeys = ['expiryDateSort', 'category'];
    return filterKeys.some((key) => queryParams[key]);
  }

  clearAllFilters(): void {
    const paramsToRemove = ['expiryDateSort', 'category'];
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
}
