import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  ViewChild,
  TemplateRef,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  Download,
  SlidersHorizontal,
  XCircle,
  Eye,
  Trash2,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import { SelectOption } from '../../components/select/select.component';
import { SelectComponent } from '../../components/select/select.component';
import { ExportSelectComponent } from '../../components/export-select/export-select.component';
import {
  DataTableComponent,
  TableColumn,
} from '../../components/data-table/data-table.component';
import {
  ActionMenuComponent,
  ActionMenuItem,
} from '../../components/action-menu/action-menu.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

export interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  userId: string;
  userRole: string;
  eventTitle: string;
  eventDescription: string;
  status: 'Success' | 'Failed';
}

@Component({
  selector: 'app-audit-logs',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    SelectComponent,
    ExportSelectComponent,
    DataTableComponent,
    PopupComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './audit-logs.component.html',
})
export class AuditLogsComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isViewModalOpen = signal(false);
  logToDelete: AuditLog | null = null;
  viewingLog: AuditLog | null = null;

  filterForm = this.fb.group({
    dateFilter: new FormControl<string | null>(null),
    status: new FormControl<string | null>(null),
  });

  public readonly icons = {
    Search,
    Download,
    SlidersHorizontal,
    XCircle,
    Eye,
    Trash2,
  };

  // Date filter options for filter modal
  dateFilterOptions: SelectOption[] = [
    { id: '24h', name: 'Last 24 Hours' },
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last Month' },
    { id: '90d', name: 'Last 3 Months' },
    { id: '365d', name: 'Last Year' },
  ];

  // Status filter options for filter modal
  statusFilterOptions: SelectOption[] = [
    { id: 'Success', name: 'Success' },
    { id: 'Failed', name: 'Failed' },
  ];

  exportOptions: SelectOption[] = [
    { id: 'pdf', name: 'PDF' },
    { id: 'excel', name: 'Excel' },
  ];

  auditLogs: AuditLog[] = [
    {
      id: 'A001',
      timestamp: new Date('2024-01-15T10:30:00'),
      user: 'John Doe',
      userId: 'U001',
      userRole: 'Admin',
      eventTitle: 'USER CREATE',
      eventDescription: 'Created new user account for Jane Smith',
      status: 'Success',
    },
    {
      id: 'A002',
      timestamp: new Date('2024-01-15T11:15:00'),
      user: 'Jane Smith',
      userId: 'U002',
      userRole: 'Pharmacist',
      eventTitle: 'PRODUCT DELETE',
      eventDescription: 'Attempted to delete product P001',
      status: 'Failed',
    },
    {
      id: 'A003',
      timestamp: new Date('2024-01-15T12:00:00'),
      user: 'Michael Brown',
      userId: 'U003',
      userRole: 'Nurse',
      eventTitle: 'USER UPDATE',
      eventDescription: 'Updated user profile information',
      status: 'Success',
    },
    {
      id: 'A004',
      timestamp: new Date('2024-01-14T09:20:00'),
      user: 'Sarah Johnson',
      userId: 'U004',
      userRole: 'Manager',
      eventTitle: 'PRODUCT CREATE',
      eventDescription: 'Created new product Paracetamol 500mg',
      status: 'Success',
    },
    {
      id: 'A005',
      timestamp: new Date('2024-01-14T14:45:00'),
      user: 'David Wilson',
      userId: 'U005',
      userRole: 'Pharmacist',
      eventTitle: 'USER DELETE',
      eventDescription: 'Deleted user account U006',
      status: 'Success',
    },
    {
      id: 'A006',
      timestamp: new Date('2024-01-13T16:30:00'),
      user: 'Emily Davis',
      userId: 'U006',
      userRole: 'Nurse',
      eventTitle: 'PRODUCT UPDATE',
      eventDescription: 'Updated product quantity for P002',
      status: 'Failed',
    },
  ];

  tableColumns = signal<TableColumn[]>([]);

  @ViewChild('detailsCellTemplate') detailsCellTemplate?: TemplateRef<any>;
  @ViewChild('statusCellTemplate') statusCellTemplate?: TemplateRef<any>;
  @ViewChild('userCellTemplate') userCellTemplate?: TemplateRef<any>;
  @ViewChild('timestampCellTemplate') timestampCellTemplate?: TemplateRef<any>;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.tableColumns.set([
      {
        key: 'timestamp',
        label: 'Timestamp',
        cellTemplate: this.timestampCellTemplate,
      },
      {
        key: 'user',
        label: 'User',
        cellTemplate: this.userCellTemplate,
      },
      {
        key: 'details',
        label: 'Details',
        cellTemplate: this.detailsCellTemplate,
      },
      {
        key: 'status',
        label: 'Status',
        cellTemplate: this.statusCellTemplate,
      },
    ]);
  }

  get filteredAuditLogs(): any[] {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    const queryParams = this.route.snapshot.queryParams;
    const dateFilter = queryParams['dateFilter'];
    const statusFilter = queryParams['status'];

    let filtered = [...this.auditLogs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.user.toLowerCase().includes(searchTerm) ||
          log.eventTitle.toLowerCase().includes(searchTerm) ||
          log.eventDescription.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date filter from URL
    if (dateFilter) {
      const now = new Date();
      let cutoffDate = new Date();

      switch (dateFilter) {
        case '24h':
          cutoffDate.setHours(now.getHours() - 24);
          break;
        case '7d':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case '365d':
          cutoffDate.setDate(now.getDate() - 365);
          break;
      }

      filtered = filtered.filter((log) => log.timestamp >= cutoffDate);
    }

    // Apply status filter from URL
    if (statusFilter) {
      filtered = filtered.filter((log) => log.status === statusFilter);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return filtered;
  }

  onExportTypeChange(value: string | number | null): void {
    if (value === 'pdf') {
      console.log('Export as PDF');
    } else if (value === 'excel') {
      console.log('Export as Excel');
    }
  }

  onViewLog(logId: string): void {
    const log = this.auditLogs.find((l) => l.id === logId);
    if (log) {
      this.viewingLog = log;
      this.isViewModalOpen.set(true);
    }
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.viewingLog = null;
  }

  onDeleteLog(logId: string): void {
    const log = this.auditLogs.find((l) => l.id === logId);
    if (log) {
      this.logToDelete = log;
      this.isDeleteModalOpen.set(true);
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.logToDelete = null;
  }

  confirmDelete(): void {
    if (this.logToDelete) {
      const index = this.auditLogs.findIndex(
        (l) => l.id === this.logToDelete!.id
      );
      if (index !== -1) {
        this.auditLogs.splice(index, 1);
      }
    }
    this.closeDeleteModal();
  }

  getMenuItems = (log: AuditLog): ActionMenuItem[] => {
    return [
      {
        label: 'View',
        action: () => this.onViewLog(log.id),
        icon: this.icons.Eye,
      },
      {
        label: 'Delete',
        action: () => this.onDeleteLog(log.id),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  openFilterModal(): void {
    // Load current filter values from URL params
    const queryParams = this.route.snapshot.queryParams;
    this.filterForm.patchValue({
      dateFilter: queryParams['dateFilter'] || null,
      status: queryParams['status'] || null,
    });
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
  }

  onDateFilterChange(value: string | number | null): void {
    this.filterForm.patchValue({ dateFilter: value as string | null });
  }

  onStatusFilterChange(value: string | number | null): void {
    this.filterForm.patchValue({ status: value as string | null });
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    const queryParams: any = { ...this.route.snapshot.queryParams };

    // Update query params based on form values
    if (formValue.dateFilter) {
      queryParams['dateFilter'] = formValue.dateFilter;
    } else {
      delete queryParams['dateFilter'];
    }

    if (formValue.status) {
      queryParams['status'] = formValue.status;
    } else {
      delete queryParams['status'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });

    this.closeFilterModal();
  }

  get hasActiveFilters(): boolean {
    const queryParams = this.route.snapshot.queryParams;
    return !!(queryParams['dateFilter'] || queryParams['status']);
  }

  clearAllFilters(): void {
    const paramsToRemove = ['dateFilter', 'status'];
    const currentParams = { ...this.route.snapshot.queryParams };

    paramsToRemove.forEach((key) => {
      delete currentParams[key];
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
    });

    this.filterForm.reset();
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

  get deleteModalPrimaryAction() {
    return {
      label: 'Delete',
      variant: 'danger' as const,
      action: () => this.confirmDelete(),
    };
  }

  get deleteModalSecondaryAction() {
    return {
      label: 'Cancel',
      variant: 'secondary' as const,
      action: () => this.closeDeleteModal(),
    };
  }

  get deleteModalDescription(): string {
    if (this.logToDelete) {
      return `Are you sure you want to delete the audit log "${this.logToDelete.eventTitle}"? This action cannot be undone.`;
    }
    return '';
  }

  get viewModalPrimaryAction() {
    return {
      label: 'Close',
      variant: 'primary' as const,
      action: () => this.closeViewModal(),
    };
  }

  get viewModalSecondaryAction() {
    return null;
  }

  formatTimestamp(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
}
