import {
  Component,
  input,
  output,
  signal,
  HostListener,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';
import {
  ReactiveFormsModule,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';

export interface SelectOption {
  id: string | number;
  name: string;
}

@Component({
  selector: 'app-select',
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class SelectComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);

  options = input<SelectOption[]>([]);
  selectedValue = input<string | number | null>(null);
  placeholder = input('Select an option');
  disabled = input(false);
  iconOnly = input(false);
  icon = input<any>(null);
  size = input<'sm' | 'md' | 'lg'>('md');
  width = input<string>('auto');
  enableSearch = input(false);
  searchControlName = input<string | null>(null);
  searchPlaceholder = input<string>('Search...');

  selectionChange = output<string | number | null>();

  isOpen = signal(false);
  public readonly icons = { ChevronDown };

  private onCaptureClick = (event: Event) => {
    // Close when clicking anywhere outside the component, even if
    // intermediate elements stopped bubbling.
    const target = event.target as Node | null;
    if (!target) return;
    if (this.isOpen() && !this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  };

  ngOnInit(): void {
    // Use capture phase to ensure we see clicks inside modals that call stopPropagation
    document.addEventListener('click', this.onCaptureClick, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onCaptureClick, true);
  }

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
      'flex items-center gap-3 rounded-xl font-light border transition-all duration-200 w-full';
    const disabledClasses = this.disabled()
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
      : ' text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm h-10',
      md: 'px-3 py-0 text-base h-12',
      lg: 'px-4 py-0 text-lg h-14',
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
    return `absolute top-full left-0 mt-2 bg-gray-50 border-gray-200 rounded-xl shadow-lg z-50 ${widthClass}`;
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
