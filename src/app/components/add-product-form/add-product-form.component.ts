import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { SelectComponent, SelectOption } from '../select/select.component';
import { InlineDateInputComponent } from '../inline-date-input/inline-date-input.component';
import { SAMPLE_STOCK } from '../../constants/stock.constants';

@Component({
  selector: 'app-add-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    InlineDateInputComponent,
  ],
  templateUrl: './add-product-form.component.html',
})
export class AddProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() supplierId: string | null = null;
  @Input() supplierName: string | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  // Select options for dropdowns
  drugClassOptions: SelectOption[] = [
    { id: 'Pain Killer', name: 'Pain Killer' },
    { id: 'Antibiotic', name: 'Antibiotic' },
    { id: 'Antipyretic', name: 'Antipyretic' },
    { id: 'Antimalarial', name: 'Antimalarial' },
  ];

  dosageFormOptions: SelectOption[] = [
    { id: 'tablet', name: 'Tablet' },
    { id: 'capsule', name: 'Capsule' },
    { id: 'syrup', name: 'Syrup' },
    { id: 'injection', name: 'Injection' },
    { id: 'ointment', name: 'Ointment' },
  ];

  unitOptions: SelectOption[] = [
    { id: 'mg', name: 'mg' },
    { id: 'g', name: 'g' },
    { id: 'mcg', name: 'mcg' },
    { id: 'ml', name: 'ml' },
  ];

  discountTypeOptions: SelectOption[] = [
    { id: 'percentage', name: 'Percentage (%)' },
    { id: 'flat', name: 'Flat (GHS)' },
  ];

  shelveOptions: SelectOption[] = [
    { id: 'AMA', name: 'AMA' },
    { id: 'BMB', name: 'BMB' },
    { id: 'CMC', name: 'CMC' },
    { id: 'DMD', name: 'DMD' },
    { id: 'EME', name: 'EME' },
    { id: 'FMF', name: 'FMF' },
  ];

  supplierOptions: SelectOption[] = [
    { id: 'Johnson & Johnson', name: 'Johnson & Johnson' },
    { id: 'Tobinco Pharmaceuticals', name: 'Tobinco Pharmaceuticals' },
    { id: 'Pfizer', name: 'Pfizer' },
    { id: 'GlaxoSmithKline', name: 'GlaxoSmithKline' },
  ];

  // Local state for selects
  selectedDrugClass: string | number | null = '';
  selectedDosageForm: string | number | null = '';
  selectedUnit: string | number | null = 'mg';
  selectedShelve: string | number | null = null;
  selectedSupplierName: string | number | null = null;

  // Form
  addProductForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    shelve: new FormControl<string | null>(null),
    shelveSearch: new FormControl<string>(''),
    drugClass: new FormControl<string>('', { nonNullable: true }),
    quantity: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    strength: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    unit: new FormControl<string>('mg', { nonNullable: true }),
    expiryDate: new FormControl<string>(''),
    brand: new FormControl<string>(''),
    dosageForm: new FormControl<string>(''),
    stockThreshold: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    costPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    cashPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    creditPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    wholesalePrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    trekPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    discountType: new FormControl<'flat' | 'percentage'>('percentage', {
      validators: [Validators.required],
    }),
    discount: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    supplierName: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    // Pre-fill supplier if provided
    if (this.supplierName) {
      this.selectedSupplierName = this.supplierName;
      this.addProductForm.patchValue({ supplierName: this.supplierName });
    }
  }

  @ViewChild('submitButton', { static: false })
  submitButton?: ElementRef<HTMLButtonElement>;

  submitForm(): void {
    if (this.addProductForm.invalid) {
      this.addProductForm.markAllAsTouched();
      return;
    }
    const value = this.addProductForm.getRawValue();
    this.formSubmit.emit(value);
    this.resetForm();
  }

  onSubmit(): void {
    this.submitForm();
  }

  onCancel(): void {
    this.formCancel.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.addProductForm.reset({ unit: 'mg', discountType: 'percentage' });
    this.selectedShelve = null;
    this.selectedDrugClass = '';
    this.selectedDosageForm = '';
    this.selectedUnit = 'mg';
    if (this.supplierName) {
      this.selectedSupplierName = this.supplierName;
      this.addProductForm.patchValue({ supplierName: this.supplierName });
    } else {
      this.selectedSupplierName = null;
    }
  }

  // Select change handlers
  onDrugClassChange(value: string | number | null): void {
    this.selectedDrugClass = value;
    this.addProductForm.patchValue({ drugClass: (value ?? '').toString() });
  }

  onDosageFormChange(value: string | number | null): void {
    this.selectedDosageForm = value;
    this.addProductForm.patchValue({ dosageForm: (value ?? '').toString() });
  }

  onUnitChange(value: string | number | null): void {
    this.selectedUnit = value;
    this.addProductForm.patchValue({ unit: (value ?? '').toString() });
  }

  onShelveChange(value: string | number | null): void {
    this.selectedShelve = value;
    this.addProductForm.patchValue({ shelve: (value as string) || null });
  }

  onDiscountTypeChange(value: string | number | null): void {
    this.addProductForm.patchValue({
      discountType: value as 'flat' | 'percentage',
    });
  }

  onSupplierNameChange(value: string | number | null): void {
    this.selectedSupplierName = value;
    this.addProductForm.patchValue({ supplierName: value as string | null });
  }
}
