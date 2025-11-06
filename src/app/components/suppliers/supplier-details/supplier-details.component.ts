import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Globe, MapPin, Phone, Mail } from 'lucide-angular';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { SupplierReviewComponent, Review } from '../supplier-review/supplier-review.component';
import { Supplier } from '../../../pages/suppliers/suppliers.component';

@Component({
  selector: 'app-supplier-details',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    StarRatingComponent,
    SupplierReviewComponent,
  ],
  templateUrl: './supplier-details.component.html',
})
export class SupplierDetailsComponent {
  supplier = input.required<Supplier>();
  reviews = input<Review[]>([]);

  public readonly icons = {
    Globe,
    MapPin,
    Phone,
    Mail,
  };
}

