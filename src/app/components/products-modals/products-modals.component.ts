import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { PopupComponent, PopupAction } from '../popup/popup.component';
import { ConfirmationModalComponent, ConfirmationAction } from '../confirmation-modal/confirmation-modal.component';
import { SelectComponent, SelectOption } from '../select/select.component';
import { InputComponent } from '../input/input.component';
import { InlineDateInputComponent } from '../inline-date-input/inline-date-input.component';

@Component({
  selector: 'app-products-modals',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopupComponent,
    ConfirmationModalComponent,
    SelectComponent,
    InputComponent,
    InlineDateInputComponent,
  ],
  templateUrl: './products-modals.component.html',
})
export class ProductsModalsComponent {
  // Filter Modal Inputs
  isFilterModalOpen = input(false);
  filterForm = input.required<FormGroup>();
  categoryOptions = input.required<SelectOption[]>();
  expiryDateSortOptions = input.required<SelectOption[]>();
  branchOptions = input.required<SelectOption[]>();

  // Delete Modal Inputs
  isDeleteModalOpen = input(false);
  deleteModalDescription = input('');

  // View Product Modal Inputs
  isViewProductModalOpen = input(false);
  viewingProduct = input<any>(null);
  isEditMode = input(false);
  editProductForm = input.required<FormGroup>();
  productNameOptions = input.required<SelectOption[]>();
  shelveOptions = input.required<SelectOption[]>();
  dosageFormOptions = input.required<SelectOption[]>();
  unitOptions = input.required<SelectOption[]>();
  supplierOptions = input.required<SelectOption[]>();
  selectedShelve = input<string | number | null>(null);
  selectedDosageForm = input<string | number | null>(null);
  selectedUnit = input<string | number | null>(null);
  selectedSupplierName = input<string | number | null>(null);

  // Filter Modal Events
  filterModalClose = output<void>();
  onCategoryChange = output<string | number | null>();
  onExpiryDateSortChange = output<string | number | null>();
  onBranchChange = output<string | number | null>();
  applyFilters = output<void>();

  // Delete Modal Events
  deleteModalClose = output<void>();
  confirmDelete = output<void>();

  // View Product Modal Events
  viewProductModalClose = output<void>();
  onProductNameChange = output<string | number | null>();
  onCategoryChangeInEdit = output<string | number | null>();
  onShelveChangeInEdit = output<string | number | null>();
  onDosageFormChangeInEdit = output<string | number | null>();
  onUnitChangeInEdit = output<string | number | null>();
  onBranchChangeInEdit = output<string | number | null>();
  onSupplierNameChange = output<string | number | null>();
  saveProductChanges = output<void>();
  enterEditMode = output<void>();
  cancelEdit = output<void>();

  // Computed properties for modal actions
  filterModalPrimaryAction = computed<PopupAction>(() => ({
    label: 'Apply Filters',
    variant: 'primary',
    action: () => this.applyFilters.emit(),
  }));

  filterModalSecondaryAction = computed<PopupAction>(() => ({
    label: 'Cancel',
    variant: 'secondary',
    action: () => this.filterModalClose.emit(),
  }));

  deleteModalPrimaryAction = computed<ConfirmationAction>(() => ({
    label: 'Delete',
    variant: 'danger',
    action: () => this.confirmDelete.emit(),
  }));

  deleteModalSecondaryAction = computed<ConfirmationAction>(() => ({
    label: 'Cancel',
    variant: 'secondary',
    action: () => this.deleteModalClose.emit(),
  }));

  viewProductModalPrimaryAction = computed<PopupAction>(() => {
    if (this.isEditMode()) {
      return {
        label: 'Save',
        variant: 'primary',
        action: () => this.saveProductChanges.emit(),
      };
    } else {
      return {
        label: 'Edit',
        variant: 'primary',
        action: () => this.enterEditMode.emit(),
      };
    }
  });

  viewProductModalSecondaryAction = computed<PopupAction>(() => {
    if (this.isEditMode()) {
      return {
        label: 'Cancel',
        variant: 'secondary',
        action: () => this.cancelEdit.emit(),
      };
    } else {
      return {
        label: 'Close',
        variant: 'secondary',
        action: () => this.viewProductModalClose.emit(),
      };
    }
  });

  // Helper methods
  handleCategoryChange(value: string | number | null): void {
    this.onCategoryChange.emit(value);
  }

  handleExpiryDateSortChange(value: string | number | null): void {
    this.onExpiryDateSortChange.emit(value);
  }

  handleBranchChange(value: string | number | null): void {
    this.onBranchChange.emit(value);
  }

  handleProductNameChange(value: string | number | null): void {
    this.onProductNameChange.emit(value);
  }

  handleCategoryChangeInEdit(value: string | number | null): void {
    this.onCategoryChangeInEdit.emit(value);
  }

  handleShelveChangeInEdit(value: string | number | null): void {
    this.onShelveChangeInEdit.emit(value);
  }

  handleDosageFormChangeInEdit(value: string | number | null): void {
    this.onDosageFormChangeInEdit.emit(value);
  }

  handleUnitChangeInEdit(value: string | number | null): void {
    this.onUnitChangeInEdit.emit(value);
  }

  handleBranchChangeInEdit(value: string | number | null): void {
    this.onBranchChangeInEdit.emit(value);
  }

  handleSupplierNameChange(value: string | number | null): void {
    this.onSupplierNameChange.emit(value);
  }

  // Helper methods to get FormControls with proper typing
  getControl(controlName: string): FormControl {
    return this.editProductForm().get(controlName) as FormControl;
  }
}

