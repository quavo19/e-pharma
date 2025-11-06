import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Globe, Eye, ShoppingCart } from 'lucide-angular';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Supplier } from '../../../pages/suppliers/suppliers.component';

@Component({
  selector: 'app-supplier-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, StarRatingComponent],
  templateUrl: './supplier-card.component.html',
})
export class SupplierCardComponent {
  supplier = input.required<Supplier>();
  favoriteToggled = output<Supplier>();
  viewClicked = output<Supplier>();
  buyClicked = output<Supplier>();

  public readonly icons = {
    Globe,
    Eye,
    ShoppingCart,
  };

  onFavoriteClick(): void {
    this.favoriteToggled.emit(this.supplier());
  }

  onViewClick(): void {
    this.viewClicked.emit(this.supplier());
  }

  onBuyClick(): void {
    this.buyClicked.emit(this.supplier());
  }
}

