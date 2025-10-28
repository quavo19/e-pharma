import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 relative"
    >
      <div
        class="absolute -left-40 -top-40 w-80 h-80 rounded-full bg-green-400/40 blur-3xl z-0"
      ></div>

      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          class="absolute inset-0 opacity-15"
          style="
          background-size: 40px 40px;
          background-image: linear-gradient(
              to right,
              #10b981 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, #10b981 1px, transparent 1px);
        "
        ></div>
      </div>
      <div class="text-center flex flex-col items-center justify-center">
        <div class="mb-6 group cursor-pointer">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            class="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          >
            <!-- Document background -->
            <rect
              x="25"
              y="20"
              width="50"
              height="60"
              rx="4"
              fill="#d1fae5"
              stroke="#22c55e"
              stroke-width="2"
              class="transition-all duration-300 group-hover:fill-green-200"
            />

            <!-- Document fold -->
            <path
              d="M 65 20 L 75 30 L 65 30 Z"
              fill="#bbf7d0"
              stroke="#22c55e"
              stroke-width="1"
              class="transition-all duration-300 group-hover:fill-green-300"
            />

            <!-- Question mark -->
            <text
              x="50"
              y="55"
              text-anchor="middle"
              fill="#22c55e"
              font-size="24"
              font-weight="bold"
              class="transition-all duration-300 group-hover:fill-green-500"
            >
              ?
            </text>

            <!-- Search magnifying glass -->
            <circle
              cx="20"
              cy="25"
              r="8"
              fill="none"
              stroke="#22c55e"
              stroke-width="2"
              class="transition-all duration-300 group-hover:stroke-green-500"
            />
            <path
              d="M 26 31 L 30 35"
              stroke="#22c55e"
              stroke-width="2"
              stroke-linecap="round"
              class="transition-all duration-300 group-hover:stroke-green-500"
            />

            <!-- Warning spark effect -->
            <g
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <path
                d="M 15 15 L 18 18 L 15 21 L 12 18 Z"
                fill="#84cc16"
                class="animate-pulse"
              />
              <path
                d="M 12 12 L 15 15 L 12 18 L 9 15 Z"
                fill="#65a30d"
                class="animate-pulse"
                style="animation-delay: 0.2s"
              />
            </g>
          </svg>
        </div>
        <h1 class="text-6xl font-bold text-primary-color mb-4!">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4!">
          Page Not Found
        </h2>
        <p class="text-gray-600 mb-8!">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <app-button title="Go Back" (click)="goBack()"> Go Back </app-button>
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
