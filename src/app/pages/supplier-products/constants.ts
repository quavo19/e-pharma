import { SelectOption } from '../../components/select/select.component';

export interface SupplierProduct {
  id: string;
  name: string;
  category: string;
  stock: string;
  quantity: number;
  status: string;
  expiryDate: string;
  inputtedBy: string;
  facility: string;
  dosageForm?: string;
  strength?: number;
  unit?: string;
  brand?: string;
  stockThreshold?: number;
  costPrice: number;
  sellingPrice?: number;
  discountValue?: number;
  supplierName?: string;
  supplierContact?: string;
}

export const SAMPLE_PRODUCTS: SupplierProduct[] = [
  {
    id: 'P001',
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    stock: 'Available',
    quantity: 150,
    status: 'Active',
    expiryDate: '2026-03-15',
    inputtedBy: 'Alice Johnson',
    facility: 'main',
    dosageForm: 'tablet',
    strength: 500,
    unit: 'mg',
    brand: 'GSK',
    stockThreshold: 20,
    costPrice: 5.5,
    sellingPrice: 8.0,
    discountValue: 10,
    supplierName: 'Johnson & Johnson',
    supplierContact: '+233 24 111 2222',
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
    facility: 'east',
    dosageForm: 'capsule',
    strength: 250,
    unit: 'mg',
    brand: 'Pfizer',
    stockThreshold: 15,
    costPrice: 12.0,
    sellingPrice: 18.0,
    discountValue: 5,
    supplierName: 'Johnson & Johnson',
    supplierContact: '+233 24 111 2222',
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
    facility: 'west',
    dosageForm: 'tablet',
    strength: 1000,
    unit: 'mg',
    brand: 'Nature Made',
    stockThreshold: 30,
    costPrice: 3.5,
    sellingPrice: 6.0,
    discountValue: 15,
    supplierName: 'Johnson & Johnson',
    supplierContact: '+233 24 111 2222',
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
    facility: 'main',
    dosageForm: 'tablet',
    strength: 400,
    unit: 'mg',
    brand: 'Advil',
    stockThreshold: 25,
    costPrice: 4.0,
    sellingPrice: 7.5,
    discountValue: 8,
    supplierName: 'Johnson & Johnson',
    supplierContact: '+233 24 111 2222',
  },
];

export const BRANCH_OPTIONS: SelectOption[] = [
  { id: 'main', name: 'Main Facility' },
  { id: 'east', name: 'East Wing' },
  { id: 'west', name: 'West Wing' },
  { id: 'north', name: 'North Wing' },
];

export const EXPIRY_DATE_SORT_OPTIONS: SelectOption[] = [
  { id: 'asc', name: 'Ascending' },
  { id: 'desc', name: 'Descending' },
];

export const getCartStorageKey = (supplierId: string | null): string => {
  return `supplier_cart_${supplierId}`;
};

