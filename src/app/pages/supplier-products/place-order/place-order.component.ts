import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { PopupComponent } from '../../../components/popup/popup.component';
import { SelectComponent, SelectOption } from '../../../components/select/select.component';
import { InputComponent } from '../../../components/input/input.component';
import { CartItem } from '../cart/cart.component';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopupComponent,
    SelectComponent,
    InputComponent,
  ],
  templateUrl: './place-order.component.html',
})
export class PlaceOrderComponent {
  private fb = inject(FormBuilder);

  isOpen = input(false);
  cartItems = input<CartItem[]>([]);
  cartTotal = input<number>(0);
  branchOptions = input<SelectOption[]>([]);

  close = output<void>();
  placeOrder = output<{
    branch: string | number;
    contactNumber?: string;
    notes?: string;
  }>();

  placeOrderForm = this.fb.group({
    branch: new FormControl<string | null>(null),
    branchSearch: new FormControl<string>(''),
    contactNumber: new FormControl<string>(''),
    notes: new FormControl<string>(''),
  });

  selectedBranch: string | number | null = null;

  onClose(): void {
    this.close.emit();
    this.placeOrderForm.reset();
    this.selectedBranch = null;
  }

  onBranchChange(value: string | number | null): void {
    this.selectedBranch = value;
    this.placeOrderForm.patchValue({ branch: value as string | null });
  }

  onSubmit(): void {
    if (!this.selectedBranch) {
      return;
    }

    const formValue = this.placeOrderForm.value;
    this.placeOrder.emit({
      branch: this.selectedBranch,
      contactNumber: formValue.contactNumber || undefined,
      notes: formValue.notes || undefined,
    });

    this.placeOrderForm.reset();
    this.selectedBranch = null;
  }

  get placeOrderModalPrimaryAction() {
    return {
      label: 'Place Order',
      variant: 'primary' as const,
      action: () => this.onSubmit(),
      disabled: !this.selectedBranch,
    };
  }

  get placeOrderModalSecondaryAction() {
    return {
      label: 'Cancel',
      variant: 'secondary' as const,
      action: () => this.onClose(),
    };
  }
}

