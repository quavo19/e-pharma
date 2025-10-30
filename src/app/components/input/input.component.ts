import { CommonModule } from '@angular/common';
import { Component, input, Output, EventEmitter, output } from '@angular/core';
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
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly variant = input<'default' | 'select'>('default');

  @Output() inputBlur = new EventEmitter<FocusEvent>();

  protected handleyKeyEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.keyEvent.emit();
  }

  public sizeClasses(): string {
    const size = this.size();
    if (size === 'sm') return 'h-10 text-sm px-3';
    if (size === 'lg') return 'h-14 text-lg px-4';
    return 'h-12 text-base px-3';
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
    const base = `border block w-full rounded-xl outline-none placeholder:text-typo-primary ${this.sizeClasses()}`;
    const variant = this.variantClasses();
    const errorClass = this.errorMessage()
      ? 'border-red-400'
      : this.variant() === 'select'
      ? 'border-gray-300'
      : 'border-light';
    const disabledClass = this.isDisabled()
      ? 'bg-gray-100 cursor-not-allowed opacity-50'
      : '';
    return `${base} ${variant} ${errorClass} ${disabledClass}`.trim();
  }
}
