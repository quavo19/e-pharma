import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
} from 'lucide-angular';
import { PopupComponent } from '../../../components/popup/popup.component';

export interface CartItem {
  productId: string;
  product: any;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PopupComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  isOpen = input(false);
  cartItems = input<CartItem[]>([]);
  cartTotal = input<number>(0);

  close = output<void>();
  increaseQuantity = output<string>();
  decreaseQuantity = output<string>();
  removeItem = output<string>();
  proceedToPlaceOrder = output<void>();

  public readonly icons = {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
  };

  get hasItems(): boolean {
    return this.cartItems().length > 0;
  }

  onClose(): void {
    this.close.emit();
  }

  onIncreaseQuantity(productId: string): void {
    this.increaseQuantity.emit(productId);
  }

  onDecreaseQuantity(productId: string): void {
    this.decreaseQuantity.emit(productId);
  }

  onRemoveItem(productId: string): void {
    this.removeItem.emit(productId);
  }

  onProceedToPlaceOrder(): void {
    this.proceedToPlaceOrder.emit();
  }

  get cartModalPrimaryAction() {
    return {
      label: 'Place Order',
      variant: 'primary' as const,
      action: () => this.onProceedToPlaceOrder(),
      disabled: !this.hasItems,
    };
  }

  get cartModalSecondaryAction() {
    return {
      label: 'Close',
      variant: 'secondary' as const,
      action: () => this.onClose(),
    };
  }
}

