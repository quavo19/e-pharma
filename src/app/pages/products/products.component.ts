import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  Plus,
  Download,
  Tag,
  Building2,
  MoreVertical,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { ExportSelectComponent } from '../../components/export-select/export-select.component';
import { PopupComponent } from '../../components/popup/popup.component';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    SelectComponent,
    ExportSelectComponent,
    PopupComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  searchControl = new FormControl('');
  filterControl = new FormControl('all');

  // Add Drug form
  addDrugForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    shelve: new FormControl<string>('', { nonNullable: true }),
    drugClass: new FormControl<string>('', { nonNullable: true }),
    quantity: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    strength: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    unit: new FormControl<string>('mg', { nonNullable: true }),
    createdBy: new FormControl<string>(''),
    expiryDate: new FormControl<string>(''),
    brand: new FormControl<string>(''),
    dosageForm: new FormControl<string>(''),
    stockThreshold: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    costPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    sellingPrice: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    discountValue: new FormControl<number | null>(null, {
      validators: [Validators.min(0), Validators.max(100)],
    }),
    supplierName: new FormControl<string>(''),
    supplierContact: new FormControl<string>(''),
  });

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

  // Local state for selects
  selectedDrugClass: string | number | null = '';
  selectedDosageForm: string | number | null = '';
  selectedUnit: string | number | null = 'mg';

  public readonly icons = {
    Search,
    Plus,
    Download,
    Tag,
    Building2,
    MoreVertical,
  };

  products = [
    {
      id: 'P001',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      stock: 'Available',
      quantity: 150,
      status: 'Active',
      expiryDate: '2026-03-15',
      inputtedBy: 'Alice Johnson',
    },
    {
      id: 'P002',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      stock: 'Low Stock',
      quantity: 8,
      status: 'Active',
      expiryDate: '2025-12-01',
      inputtedBy: 'Michael Smith',
    },
    {
      id: 'P003',
      name: 'Vitamin C 1000mg',
      category: 'Vitamins',
      stock: 'Out of Stock',
      quantity: 0,
      status: 'Inactive',
      expiryDate: '2025-08-30',
      inputtedBy: 'Grace Lee',
    },
    {
      id: 'P004',
      name: 'Ibuprofen 400mg',
      category: 'Pain Relief',
      stock: 'Available',
      quantity: 75,
      status: 'Active',
      expiryDate: '2027-01-20',
      inputtedBy: 'David Kim',
    },
    {
      id: 'P005',
      name: 'Multivitamin',
      category: 'Vitamins',
      stock: 'Available',
      quantity: 200,
      status: 'Active',
      expiryDate: '2026-09-10',
      inputtedBy: 'Sara Ahmed',
    },
  ];

  openMenuIndex: number | null = null;

  categories: SelectOption[] = [
    { id: 'all', name: 'All Categories' },
    { id: 'Pain Relief', name: 'Pain Relief' },
    { id: 'Antibiotics', name: 'Antibiotics' },
    { id: 'Vitamins', name: 'Vitamins' },
  ];

  facilities: SelectOption[] = [
    { id: 'all', name: 'All Facilities' },
    { id: 'main', name: 'Main Facility' },
    { id: 'east', name: 'East Wing' },
    { id: 'west', name: 'West Wing' },
  ];

  selectedFacility: string | number | null = 'all';
  facilitySearchForm = new FormGroup({
    facilitySearch: new FormControl<string>(''),
  });

  get filteredProducts() {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    const filterTerm = this.filterControl.value;

    let filtered = this.products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.id.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
      );
    }

    if (filterTerm && filterTerm !== 'all') {
      filtered = filtered.filter((p) => p.category === filterTerm);
    }

    return filtered;
  }

  onAddProduct(): void {
    this.isAddOpen = true;
  }

  onSubmitAddDrug(): void {
    if (this.addDrugForm.invalid) {
      this.addDrugForm.markAllAsTouched();
      return;
    }
    const value = this.addDrugForm.getRawValue();
    console.log('Add Drug payload:', value);
    this.isAddOpen = false;
    this.addDrugForm.reset({ unit: 'mg' });
  }

  onExport(): void {
    console.log('Export clicked');
  }

  exportOptions: SelectOption[] = [
    { id: 'pdf', name: 'PDF' },
    { id: 'excel', name: 'Excel' },
  ];

  onExportTypeChange(value: string | number | null): void {
    if (value === 'pdf') {
      console.log('Export as PDF');
    } else if (value === 'excel') {
      console.log('Export as Excel');
    }
  }

  onViewProduct(productId: string): void {
    console.log('View product:', productId);
  }

  onEditProduct(productId: string): void {
    console.log('Edit', productId);
  }

  onDeleteProduct(productId: string): void {
    console.log('Delete', productId);
  }

  onFacilityChange(value: string | number | null): void {
    this.selectedFacility = value;
    console.log('Selected facility:', value);
  }

  isAddOpen = false;

  addDrugPrimaryAction = {
    label: 'Save',
    variant: 'primary' as const,
    action: () => this.onSubmitAddDrug(),
  };

  addDrugSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeAdd(),
  };

  closeAdd(): void {
    this.isAddOpen = false;
  }

  // Select change handlers to sync with form
  onDrugClassChange(value: string | number | null): void {
    this.selectedDrugClass = value;
    this.addDrugForm.patchValue({ drugClass: (value ?? '').toString() });
  }

  onDosageFormChange(value: string | number | null): void {
    this.selectedDosageForm = value;
    this.addDrugForm.patchValue({ dosageForm: (value ?? '').toString() });
  }

  onUnitChange(value: string | number | null): void {
    this.selectedUnit = value;
    this.addDrugForm.patchValue({ unit: (value ?? '').toString() });
  }

  toggleRowMenu(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  isMenuAbove(index: number): boolean {
    const len = this.filteredProducts.length;
    if (len < 3) return false;
    return index >= len - 3;
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.openMenuIndex = null;
  }
}
