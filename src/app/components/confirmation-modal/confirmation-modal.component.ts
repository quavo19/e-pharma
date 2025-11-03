import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

export interface ConfirmationAction {
  label: string;
  variant: 'primary' | 'secondary' | 'danger';
  action: () => void;
}

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  isOpen = input(false);
  heading = input('');
  description = input('');
  primaryAction = input<ConfirmationAction | null>(null);
  secondaryAction = input<ConfirmationAction | null>(null);

  close = output<void>();

  public readonly icons = { X };

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onPrimaryAction(): void {
    const action = this.primaryAction();
    if (action) {
      action.action();
    }
  }

  onSecondaryAction(): void {
    const action = this.secondaryAction();
    if (action) {
      action.action();
    }
  }

  getPrimaryButtonClasses(): string {
    const action = this.primaryAction();
    if (!action) return '';

    const baseClasses =
      'px-6 py-2 w-full text-sm font-medium rounded-lg transition-colors duration-200';
    const variantClasses = {
      primary: 'bg-green-600 text-white hover:bg-green-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    return `${baseClasses} ${variantClasses[action.variant]}`;
  }

  getSecondaryButtonClasses(): string {
    const action = this.secondaryAction();
    if (!action) return '';

    const baseClasses =
      'px-6 py-2 text-sm w-full font-medium rounded-lg transition-colors duration-200';
    const variantClasses = {
      primary: 'bg-green-600 text-white hover:bg-green-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    return `${baseClasses} ${variantClasses[action.variant]}`;
  }
}
