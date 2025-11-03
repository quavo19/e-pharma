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
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Download } from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import { SelectOption } from '../../components/select/select.component';
import { ExportSelectComponent } from '../../components/export-select/export-select.component';
import {
  DataTableComponent,
  TableColumn,
} from '../../components/data-table/data-table.component';
import {
  ActionMenuComponent,
  ActionMenuItem,
} from '../../components/action-menu/action-menu.component';
import { TableHeaderDropdownOption } from '../../components/table-header-dropdown/table-header-dropdown.component';

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
    ExportSelectComponent,
    DataTableComponent,
  ],
  templateUrl: './audit-logs.component.html',
})
export class AuditLogsComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchControl = new FormControl('');

  public readonly icons = {
    Search,
    Download,
  };

  // Date filter options for table header dropdown
  dateFilterOptions: TableHeaderDropdownOption[] = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last Month' },
    { id: '90d', label: 'Last 3 Months' },
    { id: '365d', label: 'Last Year' },
  ];

  // Status filter options for table header dropdown
  statusFilterOptions: TableHeaderDropdownOption[] = [
    { id: 'Success', label: 'Success' },
    { id: 'Failed', label: 'Failed' },
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
        headerDropdown: {
          options: this.dateFilterOptions,
          queryParamKey: 'dateFilter',
          clearLabel: 'Clear Filter',
        },
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
        headerDropdown: {
          options: this.statusFilterOptions,
          queryParamKey: 'status',
          clearLabel: 'Clear Filter',
        },
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
    console.log('View log:', logId);
  }

  onDeleteLog(logId: string): void {
    console.log('Delete log:', logId);
  }

  getMenuItems(log: AuditLog): ActionMenuItem[] {
    return [
      {
        label: 'View',
        action: () => this.onViewLog(log.id),
      },
      {
        label: 'Delete',
        action: () => this.onDeleteLog(log.id),
        variant: 'danger',
      },
    ];
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
