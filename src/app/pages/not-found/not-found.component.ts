import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-primary-color mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p class="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <button
          (click)="goBack()"
          class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
