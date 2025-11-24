import {
  Component,
  signal,
  inject,
  computed,
  OnInit,
  AfterViewInit,
  effect,
  ViewChild,
  TemplateRef,
  Injector,
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
  ShoppingCart,
  Plus,
  Minus,
  X,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { Sale, SaleItem } from '../sales/sales.component';
import {
  DataTableComponent,
  TableColumn,
} from '../../components/data-table/data-table.component';

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: string;
  quantity: number;
  status: string;
  expiryDate: string;
  inputtedBy: string;
  facility: string;
  sellingPrice: number; // Add selling price for purchases
}

const CART_STORAGE_KEY = 'purchases_cart';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    SelectComponent,
    PopupComponent,
    DataTableComponent,
  ],
  templateUrl: './purchases.component.html',
})
export class PurchasesComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private injector = inject(Injector);

  @ViewChild('cartButtonTemplate') cartButtonTemplate?: TemplateRef<any>;

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isCartModalOpen = signal(false);
  isCheckoutModalOpen = signal(false);
  isViewProductModalOpen = signal(false);
  isCashPaymentModalOpen = signal(false);
  isMomoPaymentModalOpen = signal(false);
  isMomoProcessingModalOpen = signal(false);
  viewingProduct: Product | null = null;
  currentSale: Sale | null = null;

  cart = signal<CartItem[]>([]);
  sales = signal<Sale[]>([]); // Store all purchases/sales

  viewProductForm = this.fb.group({
    name: new FormControl('', []),
    category: new FormControl<string | null>(null),
    stock: new FormControl<string>('', []),
    quantity: new FormControl<number | null>(null),
    expiryDate: new FormControl<string>('', []),
    sellingPrice: new FormControl<number | null>(null),
  });

  tableColumns = signal<TableColumn[]>([]);

  checkoutForm = this.fb.group({
    paymentMethod: new FormControl<'Cash' | 'MoMo'>('Cash', [
      Validators.required,
    ]),
    customerName: new FormControl('', []),
    customerPhone: new FormControl('', [Validators.required]),
    momoNetwork: new FormControl<string | null>(null, []),
  });

  filterForm = this.fb.group({
    category: new FormControl<string | null>(null),
    categorySearch: new FormControl<string>(''),
  });

  public readonly icons = {
    Search,
    XCircle,
    SlidersHorizontal,
    ShoppingCart,
    Plus,
    Minus,
    X,
  };

  // Sample products data - same structure as products page
  products = signal<Product[]>([
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
      sellingPrice: 15.0,
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
      sellingPrice: 25.0,
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
      sellingPrice: 35.0,
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
      sellingPrice: 20.0,
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
      sellingPrice: 30.0,
    },
  ]);

  categoryOptions: SelectOption[] = [
    { id: 'Pain Relief', name: 'Pain Relief' },
    { id: 'Antibiotics', name: 'Antibiotics' },
    { id: 'Vitamins', name: 'Vitamins' },
  ];

  momoNetworkOptions: SelectOption[] = [
    { id: 'MTN', name: 'MTN' },
    { id: 'Telecel', name: 'Telecel' },
    { id: 'AirtelTigo', name: 'AirtelTigo' },
  ];

  // View Product Methods
  onViewProduct = (product: Product, index: number): void => {
    this.viewingProduct = product;
    this.viewProductForm.patchValue({
      name: product.name,
      category: product.category,
      stock: product.stock,
      quantity: product.quantity,
      expiryDate: product.expiryDate,
      sellingPrice: product.sellingPrice,
    });
    this.isViewProductModalOpen.set(true);
  };

  closeViewProductModal(): void {
    this.isViewProductModalOpen.set(false);
    this.viewingProduct = null;
    this.viewProductForm.reset();
  }

  get viewProductModalSecondaryAction() {
    return {
      label: 'Close',
      variant: 'secondary' as const,
      action: () => this.closeViewProductModal(),
    };
  }

  ngAfterViewInit(): void {
    // Initialize table columns after view is initialized so template is available
    this.tableColumns.set([
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
        key: 'sellingPriceDisplay',
        label: 'Price',
      },
      {
        key: 'actions',
        label: 'Actions',
        cellTemplate: this.cartButtonTemplate,
      },
    ]);
  }

  filteredProducts = computed(() => {
    let result = [...this.products()];
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.id.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
      );
    }

    const category = this.filterForm.get('category')?.value;
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Format selling price for display
    return result.map((p) => ({
      ...p,
      sellingPriceDisplay: `GHS ${p.sellingPrice.toFixed(2)}`,
    }));
  });

  cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.total, 0);
  });

  cartItemCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  isProductInCart = (productId: string): boolean => {
    return this.cart().some((item) => item.productId === productId);
  };

  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const cartItems = JSON.parse(stored);
        this.cart.set(cartItems);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  private saveCartToStorage(): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart()));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  addToCart(product: Product): void {
    if (this.isProductInCart(product.id)) {
      return; // Already in cart, button should be disabled
    }

    const existingItem = this.cart().find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      this.cart.update((currentCart) =>
        currentCart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total:
                  (item.quantity + 1) *
                  item.unitPrice *
                  (1 - item.discount / 100),
              }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.sellingPrice,
        discount: 0,
        total: product.sellingPrice,
      };
      this.cart.update((currentCart) => [...currentCart, newItem]);
    }
  }

  removeFromCart(productId: string): void {
    this.cart.update((currentCart) =>
      currentCart.filter((item) => item.productId !== productId)
    );
  }

  increaseQuantity(productId: string): void {
    this.cart.update((currentCart) =>
      currentCart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
              total:
                (item.quantity + 1) *
                item.unitPrice *
                (1 - item.discount / 100),
            }
          : item
      )
    );
  }

  decreaseQuantity(productId: string): void {
    this.cart.update((currentCart) =>
      currentCart.map((item) => {
        if (item.productId === productId) {
          const newQuantity = Math.max(1, item.quantity - 1);
          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.unitPrice * (1 - item.discount / 100),
          };
        }
        return item;
      })
    );
  }

  openCart(): void {
    this.isCartModalOpen.set(true);
  }

  closeCart(): void {
    this.isCartModalOpen.set(false);
  }

  openCheckout(): void {
    if (this.cart().length === 0) return;
    this.closeCart();
    // Reset form to default state
    this.checkoutForm.patchValue({
      paymentMethod: 'Cash',
      customerName: '',
      customerPhone: '',
      momoNetwork: null,
    });
    this.updateCheckoutFormValidators();
    this.isCheckoutModalOpen.set(true);
  }

  closeCheckout(): void {
    this.isCheckoutModalOpen.set(false);
    this.checkoutForm.reset({
      paymentMethod: 'Cash',
      customerName: '',
      customerPhone: '',
      momoNetwork: null,
    });
    // Update validators based on payment method
    this.updateCheckoutFormValidators();
  }

  ngOnInit(): void {
    // Load cart from localStorage
    this.loadCartFromStorage();

    // Initialize form validators
    this.updateCheckoutFormValidators();

    // Watch for payment method changes
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(() => {
      this.onPaymentMethodChange();
    });

    // Save cart to localStorage whenever it changes
    // Use runInInjectionContext to run effect in injection context
    effect(
      () => {
        this.cart(); // Track cart signal
        this.saveCartToStorage();
      },
      { injector: this.injector }
    );
  }

  updateCheckoutFormValidators(): void {
    const customerNameControl = this.checkoutForm.get('customerName');
    const customerPhoneControl = this.checkoutForm.get('customerPhone');
    const momoNetworkControl = this.checkoutForm.get('momoNetwork');

    if (this.isCashPayment) {
      customerNameControl?.setValidators([Validators.required]);
      customerPhoneControl?.setValidators([Validators.required]);
      momoNetworkControl?.clearValidators();
    } else {
      customerNameControl?.clearValidators();
      customerPhoneControl?.setValidators([Validators.required]);
      momoNetworkControl?.setValidators([Validators.required]);
    }

    customerNameControl?.updateValueAndValidity();
    customerPhoneControl?.updateValueAndValidity();
    momoNetworkControl?.updateValueAndValidity();
  }

  get paymentMethod(): 'Cash' | 'MoMo' {
    return this.checkoutForm.get('paymentMethod')?.value || 'Cash';
  }

  get isCashPayment(): boolean {
    return this.paymentMethod === 'Cash';
  }

  get isMomoPayment(): boolean {
    return this.paymentMethod === 'MoMo';
  }

  onPaymentMethodChange(): void {
    this.updateCheckoutFormValidators();
    // Set customer name for MoMo
    if (this.isMomoPayment) {
      this.checkoutForm.patchValue({ customerName: 'Customer Name' });
    } else {
      this.checkoutForm.patchValue({ customerName: '' });
    }
    // Clear network when switching to cash
    if (this.isCashPayment) {
      this.checkoutForm.patchValue({ momoNetwork: null });
    }
  }

  onMomoNetworkChange(value: string | number | null): void {
    this.checkoutForm.patchValue({ momoNetwork: value as string | null });
  }

  onCheckout(): void {
    if (this.checkoutForm.valid && this.cart().length > 0) {
      const formValue = this.checkoutForm.value;
      const cartItems = this.cart();

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
      const totalDiscount = cartItems.reduce(
        (sum, item) =>
          sum + (item.unitPrice * item.quantity * item.discount) / 100,
        0
      );
      const tax = (subtotal - totalDiscount) * 0.108; // 10.8% tax
      const total = subtotal - totalDiscount + tax;

      // Create sale items
      const saleItems: SaleItem[] = cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        total: item.total,
      }));

      // Create new sale record
      const newSale: Sale = {
        id: `SAL${String(this.sales().length + 1).padStart(3, '0')}`,
        orderNumber: `ORD-${new Date().getFullYear()}-${String(
          this.sales().length + 1
        ).padStart(3, '0')}`,
        customerName: formValue.customerName || '',
        customerPhone: formValue.customerPhone || '',
        branch: 'Main Facility', // Default branch, can be made dynamic
        branchId: 'BR001',
        salesPerson: 'Current User', // Can be made dynamic
        items: saleItems,
        subtotal: subtotal,
        discount: totalDiscount,
        tax: tax,
        status: this.isCashPayment ? 'Pending' : 'Success',
        paymentType: formValue.paymentMethod || 'Cash',
        total: total,
        dateCreated: new Date().toISOString().split('T')[0],
        timeCreated: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      };

      this.currentSale = newSale;

      // Handle based on payment method
      if (this.isCashPayment) {
        // Close checkout and open cash payment modal
        this.closeCheckout();
        this.isCashPaymentModalOpen.set(true);
      } else {
        // Close checkout and show MoMo processing animation
        this.closeCheckout();
        this.isMomoProcessingModalOpen.set(true);
        
        // Add sale to list immediately
        this.sales.update((currentSales) => [...currentSales, newSale]);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
          if (this.isMomoProcessingModalOpen()) {
            this.closeMomoProcessingModal();
          }
        }, 5000);
      }
    }
  }

  closeCashPaymentModal(): void {
    this.isCashPaymentModalOpen.set(false);
    this.currentSale = null;
    // Clear cart after printing
    this.cart.set([]);
  }

  closeMomoPaymentModal(): void {
    this.isMomoPaymentModalOpen.set(false);
    this.currentSale = null;
    // Clear cart after printing
    this.cart.set([]);
  }

  closeMomoProcessingModal(): void {
    this.isMomoProcessingModalOpen.set(false);
    this.currentSale = null;
    // Clear cart after processing
    this.cart.set([]);
  }

  onCashPaymentComplete(): void {
    if (this.currentSale) {
      // Add to sales list
      this.sales.update((currentSales) => [...currentSales, this.currentSale!]);
      // Print order
      this.printOrder(this.currentSale);
      // Close modal after printing
      this.closeCashPaymentModal();
    }
  }

  onMomoPaymentVerify(): void {
    if (this.currentSale) {
      // Update sale status to Success
      this.currentSale.status = 'Success';
      // Add to sales list
      this.sales.update((currentSales) => [...currentSales, this.currentSale!]);
      // Print receipt
      this.printReceipt(this.currentSale);
      // Close modal after printing
      this.closeMomoPaymentModal();
    }
  }

  printOrder(sale: Sale): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = this.generateOrderPrintContent(sale);
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  printReceipt(sale: Sale): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = this.generateReceiptPrintContent(sale);
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  private generateOrderPrintContent(sale: Sale): string {
    const itemsRows = sale.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
          item.productName
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${
          item.quantity
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">GHS ${item.unitPrice.toFixed(
          2
        )}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">GHS ${item.total.toFixed(
          2
        )}</td>
      </tr>
    `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order - ${sale.orderNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .status {
              background-color: #fef3c7;
              color: #92400e;
              padding: 8px 16px;
              border-radius: 4px;
              display: inline-block;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background-color: #f5f5f5;
              padding: 10px;
              text-align: left;
              border-bottom: 2px solid #000;
            }
            .summary {
              margin-top: 20px;
              border-top: 2px solid #000;
              padding-top: 20px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .total-row {
              font-weight: bold;
              font-size: 18px;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px solid #000;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PHARMACY MANAGEMENT SYSTEM</h1>
            <p>Pending Order - Cash Payment</p>
          </div>
          
          <div class="status">PENDING TRANSACTION</div>
          
          <div class="info-section">
            <div class="info-row">
              <span class="info-label">Order Number:</span>
              <span>${sale.orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span>${sale.dateCreated} ${sale.timeCreated}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Branch:</span>
              <span>${sale.branch}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Sales Person:</span>
              <span>${sale.salesPerson}</span>
            </div>
            ${
              sale.customerName
                ? `
            <div class="info-row">
              <span class="info-label">Customer:</span>
              <span>${sale.customerName}</span>
            </div>
            `
                : ''
            }
            ${
              sale.customerPhone
                ? `
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span>${sale.customerPhone}</span>
            </div>
            `
                : ''
            }
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>GHS ${sale.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Discount:</span>
              <span>GHS ${sale.discount.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>GHS ${sale.tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span>GHS ${sale.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Please process cash payment and mark as complete</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateReceiptPrintContent(sale: Sale): string {
    const itemsRows = sale.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
          item.productName
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${
          item.quantity
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">GHS ${item.unitPrice.toFixed(
          2
        )}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">GHS ${item.discount.toFixed(
          2
        )}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">GHS ${item.total.toFixed(
          2
        )}</td>
      </tr>
    `
      )
      .join('');

    const paymentMethod =
      this.checkoutForm.get('paymentMethod')?.value || 'MoMo';
    const momoNetwork = this.checkoutForm.get('momoNetwork')?.value || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${sale.orderNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .status {
              background-color: #d1fae5;
              color: #065f46;
              padding: 8px 16px;
              border-radius: 4px;
              display: inline-block;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background-color: #f5f5f5;
              padding: 10px;
              text-align: left;
              border-bottom: 2px solid #000;
            }
            .summary {
              margin-top: 20px;
              border-top: 2px solid #000;
              padding-top: 20px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .total-row {
              font-weight: bold;
              font-size: 18px;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px solid #000;
            }
            .payment-info {
              background-color: #f0f9ff;
              padding: 15px;
              border-radius: 4px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PHARMACY MANAGEMENT SYSTEM</h1>
            <p>Payment Receipt</p>
          </div>
          
          <div class="status">PAYMENT SUCCESSFUL</div>
          
          <div class="info-section">
            <div class="info-row">
              <span class="info-label">Order Number:</span>
              <span>${sale.orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span>${sale.dateCreated} ${sale.timeCreated}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Branch:</span>
              <span>${sale.branch}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Sales Person:</span>
              <span>${sale.salesPerson}</span>
            </div>
            ${
              sale.customerPhone
                ? `
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span>${sale.customerPhone}</span>
            </div>
            `
                : ''
            }
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Discount</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>GHS ${sale.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Discount:</span>
              <span>GHS ${sale.discount.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>GHS ${sale.tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span>GHS ${sale.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="payment-info">
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span>${paymentMethod} ${
      momoNetwork ? `(${momoNetwork})` : ''
    }</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span>Verified</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
  }

  openFilterModal(): void {
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
  }

  onCategoryFilterChange(value: string | number | null): void {
    this.filterForm.patchValue({ category: value as string | null });
  }

  applyFilters(): void {
    this.closeFilterModal();
  }

  clearAllFilters(): void {
    this.searchControl.setValue('');
    this.filterForm.patchValue({
      category: null,
      categorySearch: '',
    });
  }

  get hasActiveFilters(): boolean {
    return !!this.filterForm.get('category')?.value;
  }

  get filterModalPrimaryAction() {
    return {
      label: 'Apply Filters',
      variant: 'primary' as const,
      action: () => this.applyFilters(),
    };
  }

  filterModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeFilterModal(),
  };

  get checkoutModalPrimaryAction() {
    return {
      label: 'Pay',
      variant: 'primary' as const,
      action: () => this.onCheckout(),
      disabled: !this.checkoutForm.valid,
    };
  }

  get cashPaymentModalPrimaryAction() {
    return {
      label: 'Print Order',
      variant: 'primary' as const,
      action: () => this.onCashPaymentComplete(),
    };
  }

  cashPaymentModalSecondaryAction = {
    label: 'Close',
    variant: 'secondary' as const,
    action: () => this.closeCashPaymentModal(),
  };

  get momoPaymentModalPrimaryAction() {
    return {
      label: 'Verify & Print Receipt',
      variant: 'primary' as const,
      action: () => this.onMomoPaymentVerify(),
    };
  }

  momoPaymentModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeMomoPaymentModal(),
  };

  checkoutModalSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeCheckout(),
  };
}
