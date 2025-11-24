import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusVariant = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
  @Input() status: string = '';
  @Input() variant: StatusVariant = 'success';

  get classes(): string {
    const baseClasses =
      'inline-block py-2 text-xs font-medium rounded-full border text-center min-w-[80px]';

    const variantClasses = {
      success: 'bg-green-100 text-green-800 border-green-500',
      error: 'bg-red-100 text-red-800 border-red-500',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-500',
    };

    return `${baseClasses} ${variantClasses[this.variant]}`;
  }
}

