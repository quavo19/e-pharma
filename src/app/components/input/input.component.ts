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

  public errorAndStateClasses(): Record<string, boolean> {
    return {
      'border-red-400': !!this.errorMessage(),
      'border-light': !this.errorMessage(),
      'bg-gray-100 cursor-not-allowed opacity-50': this.isDisabled(),
    };
  }
}
