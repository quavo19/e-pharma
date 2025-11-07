import { Component, input, output, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { PopupComponent } from '../../../components/popup/popup.component';
import { InputComponent } from '../../../components/input/input.component';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { SupplierProduct } from '../constants';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopupComponent,
    InputComponent,
    LucideAngularModule,
  ],
  templateUrl: './view-product.component.html',
})
export class ViewProductComponent {
  private fb = inject(FormBuilder);

  isOpen = input(false);
  product = input<SupplierProduct | null>(null);
  isInCart = input(false);

  close = output<void>();
  addToCart = output<SupplierProduct>();

  viewProductForm = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true }),
    category: new FormControl<string>('', { nonNullable: true }),
    stock: new FormControl<string>('', { nonNullable: true }),
    dosageForm: new FormControl<string>('', { nonNullable: true }),
    quantity: new FormControl<number | null>(null),
    strength: new FormControl<number | null>(null),
    unit: new FormControl<string>('', { nonNullable: true }),
    expiryDate: new FormControl<string>('', { nonNullable: true }),
    brand: new FormControl<string>('', { nonNullable: true }),
    stockThreshold: new FormControl<number | null>(null),
    costPrice: new FormControl<number | null>(null),
    sellingPrice: new FormControl<number | null>(null),
    discountValue: new FormControl<number | null>(null),
    supplierName: new FormControl<string>('', { nonNullable: true }),
    supplierContact: new FormControl<string>('', { nonNullable: true }),
  });

  public readonly icons = {
    ShoppingCart,
  };

  constructor() {
    effect(() => {
      const product = this.product();
      if (product) {
        this.viewProductForm.patchValue({
          name: product.name,
          category: product.category,
          stock: product.stock,
          dosageForm: product.dosageForm || '',
          quantity: product.quantity,
          strength: product.strength || null,
          unit: product.unit || '',
          expiryDate: product.expiryDate,
          brand: product.brand || '',
          stockThreshold: product.stockThreshold || null,
          costPrice: product.costPrice || null,
          sellingPrice: product.sellingPrice || null,
          discountValue: product.discountValue || null,
          supplierName: product.supplierName || '',
          supplierContact: product.supplierContact || '',
        });
        this.viewProductForm.disable();
      }
    });
  }

  onClose(): void {
    this.close.emit();
    this.viewProductForm.reset();
    this.viewProductForm.enable();
  }

  onAddToCart(): void {
    const product = this.product();
    if (product && !this.isInCart()) {
      this.addToCart.emit(product);
    }
  }

  get viewProductModalPrimaryAction() {
    return {
      label: this.isInCart() ? 'In Cart' : 'Add to Cart',
      variant: 'primary' as const,
      action: () => this.onAddToCart(),
      icon: this.icons.ShoppingCart,
      disabled: this.isInCart(),
    };
  }

  get viewProductModalSecondaryAction() {
    return {
      label: 'Close',
      variant: 'secondary' as const,
      action: () => this.onClose(),
    };
  }
}

