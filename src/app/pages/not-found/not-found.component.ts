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
            <!-- Socket base -->
            <rect
              x="20"
              y="30"
              width="60"
              height="40"
              rx="8"
              fill="#d1fae5"
              stroke="#22c55e"
              stroke-width="2"
              class="transition-all duration-300 group-hover:fill-green-200"
            />

            <!-- Socket holes -->
            <circle
              cx="35"
              cy="50"
              r="4"
              fill="#22c55e"
              class="transition-all duration-300 group-hover:fill-green-500"
            />
            <circle
              cx="65"
              cy="50"
              r="4"
              fill="#22c55e"
              class="transition-all duration-300 group-hover:fill-green-500"
            />

            <!-- Disconnected cable -->
            <path
              d="M 10 50 Q 15 45 20 50"
              stroke="#22c55e"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
              class="transition-all duration-500 group-hover:stroke-green-500"
            />

            <!-- Cable end -->
            <circle
              cx="10"
              cy="50"
              r="3"
              fill="#22c55e"
              class="transition-all duration-300 group-hover:fill-green-500"
            />

            <!-- Warning spark effect -->
            <g
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <path
                d="M 15 45 L 18 48 L 15 51 L 12 48 Z"
                fill="#84cc16"
                class="animate-pulse"
              />
              <path
                d="M 12 42 L 15 45 L 12 48 L 9 45 Z"
                fill="#65a30d"
                class="animate-pulse"
                style="animation-delay: 0.2s"
              />
            </g>

            <!-- Connection status indicator -->
            <circle
              cx="85"
              cy="35"
              r="6"
              fill="#22c55e"
              class="transition-all duration-300 group-hover:fill-green-500"
            />
            <text
              x="85"
              y="40"
              text-anchor="middle"
              fill="white"
              font-size="8"
              font-weight="bold"
              class="transition-all duration-300"
            >
              !
            </text>
          </svg>
        </div>
        <h1 class="text-6xl font-bold text-primary-color mb-4!">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4!">
          Connection Lost
        </h2>
        <p class="text-gray-600 mb-8!">
          The page you're looking for seems to have disconnected.
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
