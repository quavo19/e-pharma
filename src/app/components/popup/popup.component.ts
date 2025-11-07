import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

export interface PopupAction {
  label: string;
  variant: 'primary' | 'secondary' | 'danger';
  action: () => void;
  icon?: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-popup',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './popup.component.html',
})
export class PopupComponent {
  isOpen = input(false);
  heading = input('');
  description = input('');
  primaryAction = input<PopupAction | null>(null);
  secondaryAction = input<PopupAction | null>(null);
  variant = input<'center' | 'right'>('center');
  panelWidth = input<string>('w-[28rem]');

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
    if (action && !action.disabled) {
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
      'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200';
    const disabledClasses = action.disabled
      ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
      : '';
    const variantClasses = action.disabled
      ? {}
      : {
          primary: 'bg-green-600 text-white hover:bg-green-700',
          secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
          danger: 'bg-red-600 text-white hover:bg-red-700',
        };

    return `${baseClasses} ${
      disabledClasses || variantClasses[action.variant] || ''
    }`;
  }

  getSecondaryButtonClasses(): string {
    const action = this.secondaryAction();
    if (!action) return '';

    const baseClasses =
      'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200';
    const variantClasses = {
      primary: 'bg-green-600 text-white hover:bg-green-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    return `${baseClasses} ${variantClasses[action.variant]}`;
  }
}
