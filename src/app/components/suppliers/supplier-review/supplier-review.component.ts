import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';

export interface Review {
  pharmacyName: string;
  pharmacyImage: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-supplier-review',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './supplier-review.component.html',
})
export class SupplierReviewComponent {
  review = input.required<Review>();
}

