import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
})
export class StarRatingComponent {
  rating = input.required<number>();
  size = input<'sm' | 'md' | 'lg'>('md');
  showRating = input<boolean>(false);
  showReviewCount = input<boolean>(false);
  reviewCount = input<number>(0);

  getStarFill(index: number): number {
    const starValue = this.rating() - index;
    if (starValue >= 1) return 1; // Full star
    if (starValue > 0) return starValue; // Partial star (0 to 1)
    return 0; // Empty star
  }

  getSizeClasses(): string {
    const sizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };
    return sizes[this.size()];
  }

  getStarSize(): number {
    const sizes = {
      sm: 14,
      md: 16,
      lg: 20,
    };
    return sizes[this.size()];
  }
}

