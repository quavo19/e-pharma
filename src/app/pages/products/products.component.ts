import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
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

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  searchControl = new FormControl('');
  filterControl = new FormControl('all');

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
    },
    {
      id: 'P002',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      stock: 'Low Stock',
      quantity: 8,
      status: 'Active',
    },
    {
      id: 'P003',
      name: 'Vitamin C 1000mg',
      category: 'Vitamins',
      stock: 'Out of Stock',
      quantity: 0,
      status: 'Inactive',
    },
    {
      id: 'P004',
      name: 'Ibuprofen 400mg',
      category: 'Pain Relief',
      stock: 'Available',
      quantity: 75,
      status: 'Active',
    },
    {
      id: 'P005',
      name: 'Multivitamin',
      category: 'Vitamins',
      stock: 'Available',
      quantity: 200,
      status: 'Active',
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
    console.log('Add product clicked');
  }

  onExport(): void {
    console.log('Export clicked');
  }

  exportOptions: SelectOption[] = [
    { id: 'pdf', name: 'PDF' },
    { id: 'excel', name: 'Excel' },
  ];

  selectedExport: string | number | null = null;

  onExportTypeChange(value: string | number | null): void {
    this.selectedExport = value;
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
