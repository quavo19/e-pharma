import { Injectable, signal } from '@angular/core';
import { SupplierProduct } from '../constants';
import { getCartStorageKey } from '../constants';

export interface CartItem {
  productId: string;
  product: SupplierProduct;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<
    Map<string, { product: SupplierProduct; quantity: number }>
  >(new Map());

  loadCart(supplierId: string | null): void {
    try {
      const storageKey = getCartStorageKey(supplierId);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const cartData = JSON.parse(stored);
        const cartMap = new Map<
          string,
          { product: SupplierProduct; quantity: number }
        >();
        Object.entries(cartData).forEach(([productId, item]: [string, any]) => {
          cartMap.set(productId, item);
        });
        this.cartItems.set(cartMap);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  saveCart(supplierId: string | null): void {
    try {
      const storageKey = getCartStorageKey(supplierId);
      const cartData: any = {};
      this.cartItems().forEach((item, productId) => {
        cartData[productId] = item;
      });
      localStorage.setItem(storageKey, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  addToCart(product: SupplierProduct): void {
    const currentCart = new Map(this.cartItems());
    if (currentCart.has(product.id)) {
      const item = currentCart.get(product.id)!;
      item.quantity += 1;
    } else {
      currentCart.set(product.id, { product, quantity: 1 });
    }
    this.cartItems.set(currentCart);
  }

  increaseQuantity(productId: string): void {
    const currentCart = new Map(this.cartItems());
    if (currentCart.has(productId)) {
      const item = currentCart.get(productId)!;
      item.quantity += 1;
      this.cartItems.set(currentCart);
    }
  }

  decreaseQuantity(productId: string): void {
    const currentCart = new Map(this.cartItems());
    if (currentCart.has(productId)) {
      const item = currentCart.get(productId)!;
      if (item.quantity > 1) {
        item.quantity -= 1;
        this.cartItems.set(currentCart);
      }
    }
  }

  removeFromCart(productId: string): void {
    const currentCart = new Map(this.cartItems());
    currentCart.delete(productId);
    this.cartItems.set(currentCart);
  }

  clearCart(): void {
    this.cartItems.set(new Map());
  }

  getCartItems(): Map<string, { product: SupplierProduct; quantity: number }> {
    return this.cartItems();
  }

  getCartItemsArray(): CartItem[] {
    const items: CartItem[] = [];
    this.cartItems().forEach((item, productId) => {
      items.push({ productId, ...item });
    });
    return items;
  }

  getCartTotal(): number {
    let total = 0;
    this.cartItems().forEach((item) => {
      total += (item.product.costPrice || 0) * item.quantity;
    });
    return total;
  }

  getCartItemCount(): number {
    let total = 0;
    this.cartItems().forEach((item) => {
      total += item.quantity;
    });
    return total;
  }

  isProductInCart(productId: string): boolean {
    return this.cartItems().has(productId);
  }
}
