import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  Output,
  EventEmitter,
  output,
  effect,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './input.component.html',
})
export class InputComponent {
  public readonly label = input<string>();
  public readonly type = input<string>('text');
  public readonly className = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly hasLeftIcon = input<boolean>(false);
  public readonly hasRightIcon = input<boolean>(false);
  public readonly control = input.required<FormControl>();
  public readonly errorMessage = input<string>('');
  public readonly required = input<boolean>(false);
  public readonly isDisabled = input<boolean>(false);
  public readonly id = input.required<string>();
  public readonly keyEvent = output();
  public readonly isForChatBox = input<boolean>(false);
  public readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  public readonly variant = input<'default' | 'select'>('default');
  public readonly textarea = input<boolean>(false);

  @Output() inputBlur = new EventEmitter<FocusEvent>();

  constructor() {
    // Sync FormControl disabled state with isDisabled input
    effect(() => {
      const control = this.control();
      const disabled = this.isDisabled();
      if (control) {
        if (disabled && !control.disabled) {
          control.disable({ emitEvent: false });
        } else if (!disabled && control.disabled) {
          control.enable({ emitEvent: false });
        }
      }
    });
  }

  protected handleyKeyEvent(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key === 'Enter') this.keyEvent.emit();
  }

  protected handleKeyPress(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  protected handlePaste(event: ClipboardEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  protected handleInput(event: Event): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  public sizeClasses(): string {
    const size = this.size();
    if (this.textarea()) {
      // Textarea size classes (height for textarea)
      if (size === 'sm') return 'min-h-20 text-sm px-3 py-2 resize-none';
      if (size === 'md') return 'min-h-24 text-base px-3 py-2 resize-none';
      if (size === 'xl') return 'min-h-32 text-base px-3 py-2 resize-none';
      return 'min-h-28 text-base px-3 py-2 resize-none'; // lg
    } else {
      // Input size classes
      if (size === 'sm') return 'h-10 text-sm px-3';
      if (size === 'lg') return 'h-14 text-lg px-4';
      if (size === 'xl') return 'h-16 text-lg px-4';
      return 'h-12 text-base px-3'; // md
    }
  }

  public variantClasses(): string {
    const variant = this.variant();
    // default keeps existing design; select matches app-select bg/border tones
    if (variant === 'select') {
      return 'bg-white border-gray-300 text-gray-700';
    }
    return 'bg-light border-light';
  }

  public combinedClasses(): string {
    const base = `block w-full rounded-xl outline-none placeholder:text-typo-primary ${this.sizeClasses()}`;
    const variant = this.variantClasses();
    const borderClass = this.isDisabled()
      ? 'border-0'
      : this.errorMessage()
      ? 'border border-red-400'
      : this.variant() === 'select'
      ? 'border border-gray-300'
      : 'border border-light';
    const disabledClass = this.isDisabled()
      ? 'bg-gray-100 cursor-not-allowed opacity-50'
      : '';
    return `${base} ${variant} ${borderClass} ${disabledClass}`.trim();
  }
}
