import {
  Component,
  input,
  output,
  signal,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

export interface SelectOption {
  id: string | number;
  name: string;
}

@Component({
  selector: 'app-select',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './select.component.html',
})
export class SelectComponent {
  private elementRef = inject(ElementRef);

  options = input<SelectOption[]>([]);
  selectedValue = input<string | number | null>(null);
  placeholder = input('Select an option');
  disabled = input(false);
  iconOnly = input(false);
  icon = input<any>(null);
  size = input<'sm' | 'md' | 'lg'>('md');
  width = input<string>('auto');

  selectionChange = output<string | number | null>();

  isOpen = signal(false);
  public readonly icons = { ChevronDown };

  get selectedOption(): SelectOption | null {
    const selectedId = this.selectedValue();
    return this.options().find((option) => option.id === selectedId) || null;
  }

  get displayText(): string {
    if (this.iconOnly()) return '';
    return this.selectedOption?.name || this.placeholder();
  }

  get buttonClasses(): string {
    const baseClasses =
      'flex items-center gap-3 rounded-xl font-light border transition-all duration-200';
    const disabledClasses = this.disabled()
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-base min-h-[44px]',
      lg: 'px-5 py-4 text-lg min-h-[52px]',
    };

    return `${baseClasses} ${disabledClasses} ${sizeClasses[this.size()]}`;
  }

  get iconButtonClasses(): string {
    const baseClasses = 'p-2 rounded-lg transition-all duration-200';
    const disabledClasses = this.disabled()
      ? 'text-gray-400 cursor-not-allowed'
      : 'text-gray-600 hover:text-gray-800 hover:bg-green-200';

    return `${baseClasses} ${disabledClasses}`;
  }

  get dropdownClasses(): string {
    const widthClass = this.iconOnly() ? `${this.width()}` : 'w-full';
    return `absolute top-full left-0 mt-2  bg-white border border-gray-200 rounded-xl shadow-lg z-50 ${widthClass}`;
  }

  toggleDropdown(): void {
    if (!this.disabled()) {
      this.isOpen.set(!this.isOpen());
    }
  }

  selectOption(option: SelectOption): void {
    this.selectionChange.emit(option.id);
    this.isOpen.set(false);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      this.isOpen() &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.closeDropdown();
    }
  }
}
