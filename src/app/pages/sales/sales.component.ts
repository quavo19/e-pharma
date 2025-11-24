import {
  Component,
  signal,
  inject,
  OnInit,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  Download,
  XCircle,
  SlidersHorizontal,
  Eye,
  Printer,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from '../../components/select/select.component';
import { ExportSelectComponent } from '../../components/export-select/export-select.component';
import { PopupComponent } from '../../components/popup/popup.component';
import {
  ActionMenuComponent,
  ActionMenuItem,
} from '../../components/action-menu/action-menu.component';
import {
  DataTableComponent,
  TableColumn,
} from '../../components/data-table/data-table.component';
import { InlineDateInputComponent } from '../../components/inline-date-input/inline-date-input.component';
import { FormBuilder } from '@angular/forms';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Sale {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  branch: string;
  branchId: string;
  salesPerson: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  dateCreated: string;
  timeCreated: string;
  notes?: string;
  status: 'Success' | 'Failed' | 'Pending';
  paymentType: 'Cash' | 'MoMo';
}

@Component({
  selector: 'app-sales',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    SelectComponent,
    ExportSelectComponent,
    PopupComponent,
    DataTableComponent,
    InlineDateInputComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './sales.component.html',
})
export class SalesComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isViewSaleModalOpen = signal(false);
  viewingSale: Sale | null = null;

  tableColumns = signal<TableColumn[]>([]);

  @ViewChild('totalAmountCellTemplate')
  totalAmountCellTemplate?: TemplateRef<any>;
  @ViewChild('dateCellTemplate') dateCellTemplate?: TemplateRef<any>;
  @ViewChild('customerNameCellTemplate')
  customerNameCellTemplate?: TemplateRef<any>;
  @ViewChild('statusCellTemplate') statusCellTemplate?: TemplateRef<any>;
  @ViewChild('paymentTypeCellTemplate')
  paymentTypeCellTemplate?: TemplateRef<any>;

  filterForm = this.fb.group({
    branch: new FormControl<string | null>(null),
    branchSearch: new FormControl<string>(''),
    startDate: new FormControl<string>(''),
    endDate: new FormControl<string>(''),
    salesPerson: new FormControl<string | null>(null),
    salesPersonSearch: new FormControl<string>(''),
  });

  public readonly icons = {
    Search,
    Download,
    XCircle,
    SlidersHorizontal,
    Eye,
    Printer,
  };

  sales: Sale[] = [
    {
      id: 'SAL001',
      orderNumber: 'ORD-2024-001',
      customerName: 'John Mensah',
      customerPhone: '+233 24 123 4567',
      customerEmail: 'john.mensah@email.com',
      branch: 'Main Facility',
      branchId: 'BR001',
      salesPerson: 'Sarah Osei',
      items: [
        {
          productId: 'PRD001',
          productName: 'Paracetamol 500mg',
          quantity: 2,
          unitPrice: 15.0,
          discount: 0,
          total: 30.0,
        },
        {
          productId: 'PRD002',
          productName: 'Amoxicillin 250mg',
          quantity: 1,
          unitPrice: 25.0,
          discount: 5.0,
          total: 20.0,
        },
      ],
      subtotal: 50.0,
      discount: 5.0,
      tax: 5.4,
      total: 50.4,
      dateCreated: '2024-01-15',
      timeCreated: '10:30 AM',
      notes: 'Customer requested receipt',
      status: 'Success',
      paymentType: 'Cash',
    },
    {
      id: 'SAL002',
      orderNumber: 'ORD-2024-002',
      customerName: 'Ama Bonsu',
      customerPhone: '+233 24 234 5678',
      branch: 'Adenta Branch',
      branchId: 'BR002',
      salesPerson: 'Kwame Asante',
      items: [
        {
          productId: 'PRD003',
          productName: 'Ibuprofen 400mg',
          quantity: 3,
          unitPrice: 20.0,
          discount: 0,
          total: 60.0,
        },
      ],
      subtotal: 60.0,
      discount: 0,
      tax: 6.48,
      total: 66.48,
      dateCreated: '2024-01-15',
      timeCreated: '02:15 PM',
      status: 'Success',
      paymentType: 'MoMo',
    },
    {
      id: 'SAL003',
      orderNumber: 'ORD-2024-003',
      customerName: 'Kofi Darko',
      customerPhone: '+233 24 345 6789',
      customerEmail: 'kofi.darko@email.com',
      branch: 'Kumasi Main',
      branchId: 'BR003',
      salesPerson: 'Yaa Asantewaa',
      items: [
        {
          productId: 'PRD004',
          productName: 'Vitamin C 1000mg',
          quantity: 1,
          unitPrice: 35.0,
          discount: 0,
          total: 35.0,
        },
        {
          productId: 'PRD005',
          productName: 'Multivitamin Complex',
          quantity: 2,
          unitPrice: 45.0,
          discount: 10.0,
          total: 80.0,
        },
      ],
      subtotal: 115.0,
      discount: 10.0,
      tax: 11.34,
      total: 116.34,
      dateCreated: '2024-01-16',
      timeCreated: '09:45 AM',
      status: 'Pending',
      paymentType: 'Cash',
    },
    {
      id: 'SAL004',
      orderNumber: 'ORD-2024-004',
      customerName: 'Mary Ofori',
      customerPhone: '+233 24 456 7890',
      branch: 'Main Facility',
      branchId: 'BR001',
      salesPerson: 'Sarah Osei',
      items: [
        {
          productId: 'PRD001',
          productName: 'Paracetamol 500mg',
          quantity: 5,
          unitPrice: 15.0,
          discount: 0,
          total: 75.0,
        },
      ],
      subtotal: 75.0,
      discount: 0,
      tax: 8.1,
      total: 83.1,
      dateCreated: '2024-01-16',
      timeCreated: '11:20 AM',
      status: 'Success',
      paymentType: 'MoMo',
    },
    {
      id: 'SAL005',
      orderNumber: 'ORD-2024-005',
      customerName: 'David Appiah',
      customerPhone: '+233 24 567 8901',
      branch: 'East Wing',
      branchId: 'BR004',
      salesPerson: 'Ama Mensah',
      items: [
        {
          productId: 'PRD006',
          productName: 'Antibacterial Soap',
          quantity: 4,
          unitPrice: 12.0,
          discount: 0,
          total: 48.0,
        },
        {
          productId: 'PRD007',
          productName: 'Hand Sanitizer 500ml',
          quantity: 2,
          unitPrice: 18.0,
          discount: 0,
          total: 36.0,
        },
      ],
      subtotal: 84.0,
      discount: 0,
      tax: 9.07,
      total: 93.07,
      dateCreated: '2024-01-16',
      timeCreated: '03:45 PM',
      status: 'Failed',
      paymentType: 'Cash',
    },
  ];

  // Branch options - this would typically come from an API
  branchOptions: SelectOption[] = [
    { id: 'BR001', name: 'Main Facility' },
    { id: 'BR002', name: 'Adenta Branch' },
    { id: 'BR003', name: 'Kumasi Main' },
    { id: 'BR004', name: 'East Wing' },
    { id: 'BR005', name: 'West Wing' },
  ];

  // Sales person options
  salesPersonOptions: SelectOption[] = [
    { id: 'Sarah Osei', name: 'Sarah Osei' },
    { id: 'Kwame Asante', name: 'Kwame Asante' },
    { id: 'Yaa Asantewaa', name: 'Yaa Asantewaa' },
    { id: 'Ama Mensah', name: 'Ama Mensah' },
    { id: 'Kojo Adjei', name: 'Kojo Adjei' },
  ];

  // Local state for selects
  selectedBranch: string | number | null = null;
  selectedSalesPerson: string | number | null = null;

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.tableColumns.set([
      {
        key: 'orderNumber',
        label: 'Order Number',
      },
      {
        key: 'dateCreated',
        label: 'Date',
        cellTemplate: this.dateCellTemplate,
      },
      {
        key: 'customerName',
        label: 'Customer',
        cellTemplate: this.customerNameCellTemplate,
      },
      {
        key: 'branch',
        label: 'Branch',
      },
      {
        key: 'paymentType',
        label: 'Payment Type',
        cellTemplate: this.paymentTypeCellTemplate,
      },
      {
        key: 'status',
        label: 'Status',
        cellTemplate: this.statusCellTemplate,
      },
      {
        key: 'total',
        label: 'Total Amount',
        cellTemplate: this.totalAmountCellTemplate,
      },
    ]);
  }

  get filteredSales() {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    const queryParams = this.route.snapshot.queryParams;

    let filtered = [...this.sales];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.orderNumber.toLowerCase().includes(searchTerm) ||
          s.id.toLowerCase().includes(searchTerm) ||
          (s.customerName &&
            s.customerName.toLowerCase().includes(searchTerm)) ||
          (s.customerPhone &&
            s.customerPhone.toLowerCase().includes(searchTerm)) ||
          s.branch.toLowerCase().includes(searchTerm) ||
          s.salesPerson.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters from URL
    if (queryParams['branch']) {
      filtered = filtered.filter((s) => s.branchId === queryParams['branch']);
    }

    if (queryParams['salesPerson']) {
      filtered = filtered.filter(
        (s) => s.salesPerson === queryParams['salesPerson']
      );
    }

    if (queryParams['startDate']) {
      filtered = filtered.filter(
        (s) => s.dateCreated >= queryParams['startDate']
      );
    }

    if (queryParams['endDate']) {
      filtered = filtered.filter(
        (s) => s.dateCreated <= queryParams['endDate']
      );
    }

    return filtered;
  }

  onExportTypeChange(value: string | number | null): void {
    if (value === 'pdf') {
      this.printSale();
    } else if (value === 'excel') {
      console.log('Export sales as Excel');
      // TODO: Implement Excel export
    }
  }

  onViewSale(saleId: string): void {
    const sale = this.sales.find((s) => s.id === saleId);
    if (sale) {
      this.viewingSale = sale;
      this.isViewSaleModalOpen.set(true);
    }
  }

  closeViewSaleModal(): void {
    this.isViewSaleModalOpen.set(false);
    this.viewingSale = null;
  }

  printSale(sale?: Sale): void {
    const saleToPrint = sale || this.viewingSale;
    if (!saleToPrint) return;

    // Create a print-friendly window
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = this.generatePrintContent(saleToPrint);
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  private generatePrintContent(sale: Sale): string {
    const itemsRows = sale.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
          item.productName
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${
          item.quantity
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">GHS ${item.unitPrice.toFixed(
          2
        )}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">GHS ${item.discount.toFixed(
          2
        )}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">GHS ${item.total.toFixed(
          2
        )}</td>
      </tr>
    `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sale Receipt - ${sale.orderNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background-color: #f5f5f5;
              padding: 10px;
              text-align: left;
              border-bottom: 2px solid #000;
            }
            .summary {
              margin-top: 20px;
              border-top: 2px solid #000;
              padding-top: 20px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .total-row {
              font-weight: bold;
              font-size: 18px;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px solid #000;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PHARMACY MANAGEMENT SYSTEM</h1>
            <p>Sale Receipt</p>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <span class="info-label">Order Number:</span>
              <span>${sale.orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span>${sale.dateCreated} ${sale.timeCreated}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Branch:</span>
              <span>${sale.branch}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Sales Person:</span>
              <span>${sale.salesPerson}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Type:</span>
              <span>${sale.paymentType}</span>
            </div>
            ${
              sale.customerName
                ? `
            <div class="info-row">
              <span class="info-label">Customer:</span>
              <span>${sale.customerName}</span>
            </div>
            `
                : ''
            }
            ${
              sale.customerPhone
                ? `
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span>${sale.customerPhone}</span>
            </div>
            `
                : ''
            }
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Discount</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>GHS ${sale.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Discount:</span>
              <span>GHS ${sale.discount.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>GHS ${sale.tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span>GHS ${sale.total.toFixed(2)}</span>
            </div>
          </div>

          ${
            sale.notes
              ? `
          <div class="info-section">
            <div class="info-label">Notes:</div>
            <div>${sale.notes}</div>
          </div>
          `
              : ''
          }

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
  }

  openFilterModal(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.filterForm.patchValue({
      branch: queryParams['branch'] || null,
      startDate: queryParams['startDate'] || '',
      endDate: queryParams['endDate'] || '',
      salesPerson: queryParams['salesPerson'] || null,
      branchSearch: '',
      salesPersonSearch: '',
    });
    this.selectedBranch = queryParams['branch'] || null;
    this.selectedSalesPerson = queryParams['salesPerson'] || null;
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
  }

  onBranchFilterChange(value: string | number | null): void {
    this.selectedBranch = value;
    this.filterForm.patchValue({ branch: value as string | null });
  }

  onSalesPersonFilterChange(value: string | number | null): void {
    this.selectedSalesPerson = value;
    this.filterForm.patchValue({ salesPerson: value as string | null });
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    const queryParams: any = { ...this.route.snapshot.queryParams };

    if (formValue.branch) {
      queryParams['branch'] = formValue.branch;
    } else {
      delete queryParams['branch'];
    }

    if (formValue.salesPerson) {
      queryParams['salesPerson'] = formValue.salesPerson;
    } else {
      delete queryParams['salesPerson'];
    }

    if (formValue.startDate) {
      queryParams['startDate'] = formValue.startDate;
    } else {
      delete queryParams['startDate'];
    }

    if (formValue.endDate) {
      queryParams['endDate'] = formValue.endDate;
    } else {
      delete queryParams['endDate'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });

    this.closeFilterModal();
  }

  get hasActiveFilters(): boolean {
    const queryParams = this.route.snapshot.queryParams;
    const filterKeys = ['branch', 'startDate', 'endDate', 'salesPerson'];
    return filterKeys.some((key) => queryParams[key]);
  }

  clearAllFilters(): void {
    const paramsToRemove = ['branch', 'startDate', 'endDate', 'salesPerson'];
    const currentParams = { ...this.route.snapshot.queryParams };

    paramsToRemove.forEach((key) => {
      delete currentParams[key];
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
    });

    this.filterForm.reset();
    this.selectedBranch = null;
    this.selectedSalesPerson = null;
  }

  get filterModalPrimaryAction() {
    return {
      label: 'Apply Filters',
      variant: 'primary' as const,
      action: () => this.applyFilters(),
    };
  }

  get filterModalSecondaryAction() {
    return {
      label: 'Cancel',
      variant: 'secondary' as const,
      action: () => this.closeFilterModal(),
    };
  }

  get viewSaleModalPrimaryAction() {
    return {
      label: 'Print',
      variant: 'primary' as const,
      action: () => this.printSale(),
    };
  }

  get viewSaleModalSecondaryAction() {
    return {
      label: 'Close',
      variant: 'secondary' as const,
      action: () => this.closeViewSaleModal(),
    };
  }

  getMenuItems = (sale: { id: string }): ActionMenuItem[] => {
    return [
      {
        label: 'View',
        action: () => this.onViewSale(sale.id),
        icon: this.icons.Eye,
      },
      {
        label: 'Print',
        action: () => {
          const saleObj = this.sales.find((s) => s.id === sale.id);
          if (saleObj) this.printSale(saleObj);
        },
        icon: this.icons.Printer,
      },
    ];
  };

  formatCurrency(value: number): string {
    return `GHS ${value.toFixed(2)}`;
  }

  getStatusVariant(
    status: 'Success' | 'Failed' | 'Pending'
  ): 'success' | 'error' | 'warning' {
    switch (status) {
      case 'Success':
        return 'success';
      case 'Failed':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'success';
    }
  }

  exportOptions: SelectOption[] = [
    { id: 'pdf', name: 'PDF' },
    { id: 'excel', name: 'Excel' },
  ];
}
