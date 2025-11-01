import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  Plus,
  Download,
  XCircle,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import { SelectOption } from '../../components/select/select.component';
import { ExportSelectComponent } from '../../components/export-select/export-select.component';
import {
  ActionMenuComponent,
  ActionMenuItem,
} from '../../components/action-menu/action-menu.component';
import {
  TableHeaderDropdownComponent,
  TableHeaderDropdownOption,
} from '../../components/table-header-dropdown/table-header-dropdown.component';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
  branch: string;
  status: 'Active' | 'Inactive';
  dateAdded: string;
  avatar?: string;
  facility: string;
}

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    ExportSelectComponent,
    ActionMenuComponent,
    TableHeaderDropdownComponent,
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchControl = new FormControl('');

  facilityOptions: TableHeaderDropdownOption[] = [
    { id: 'main', label: 'Main Facility' },
    { id: 'east', label: 'East Wing' },
    { id: 'west', label: 'West Wing' },
    { id: 'north', label: 'North Wing' },
  ];

  public readonly icons = {
    Search,
    Plus,
    Download,
    XCircle,
  };

  users: User[] = [
    {
      id: 'U001',
      name: 'John Doe',
      phone: '+233 24 123 4567',
      role: 'Admin',
      branch: 'Main Branch',
      status: 'Active',
      dateAdded: '2024-01-15',
      facility: 'main',
    },
    {
      id: 'U002',
      name: 'Jane Smith',
      phone: '+233 24 234 5678',
      role: 'Pharmacist',
      branch: 'East Branch',
      status: 'Active',
      dateAdded: '2024-02-20',
      facility: 'east',
    },
    {
      id: 'U003',
      name: 'Michael Brown',
      phone: '+233 24 345 6789',
      role: 'Nurse',
      branch: 'West Branch',
      status: 'Active',
      dateAdded: '2024-03-10',
      facility: 'west',
    },
    {
      id: 'U004',
      name: 'Sarah Johnson',
      phone: '+233 24 456 7890',
      role: 'Manager',
      branch: 'Main Branch',
      status: 'Inactive',
      dateAdded: '2024-01-05',
      facility: 'main',
    },
    {
      id: 'U005',
      name: 'David Wilson',
      phone: '+233 24 567 8901',
      role: 'Pharmacist',
      branch: 'North Branch',
      status: 'Active',
      dateAdded: '2024-04-12',
      facility: 'north',
    },
    {
      id: 'U006',
      name: 'Emily Davis',
      phone: '+233 24 678 9012',
      role: 'Nurse',
      branch: 'East Branch',
      status: 'Active',
      dateAdded: '2024-02-28',
      facility: 'east',
    },
  ];

  exportOptions: SelectOption[] = [
    { id: 'pdf', name: 'PDF' },
    { id: 'excel', name: 'Excel' },
  ];

  // Dropdown options
  dateSortOptions: TableHeaderDropdownOption[] = [
    { id: 'asc', label: 'Ascending' },
    { id: 'desc', label: 'Descending' },
  ];

  nameSortOptions: TableHeaderDropdownOption[] = [
    { id: 'asc', label: 'Ascending' },
    { id: 'desc', label: 'Descending' },
  ];

  roleOptions: TableHeaderDropdownOption[] = [];

  statusOptions: TableHeaderDropdownOption[] = [
    { id: 'Active', label: 'Active' },
    { id: 'Inactive', label: 'Inactive' },
  ];

  ngOnInit(): void {
    // Extract unique roles from users
    const roles = [...new Set(this.users.map((u) => u.role))];
    this.roleOptions = roles.map((role) => ({ id: role, label: role }));
  }

  get filteredUsers() {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    const queryParams = this.route.snapshot.queryParams;

    let filtered = [...this.users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm) ||
          u.phone.toLowerCase().includes(searchTerm) ||
          u.role.toLowerCase().includes(searchTerm) ||
          u.branch.toLowerCase().includes(searchTerm) ||
          u.id.toLowerCase().includes(searchTerm)
      );
    }

    // Apply facility filter from URL
    if (queryParams['facility']) {
      filtered = filtered.filter((u) => u.facility === queryParams['facility']);
    }

    // Apply role filter from URL
    if (queryParams['role']) {
      filtered = filtered.filter((u) => u.role === queryParams['role']);
    }

    // Apply status filter from URL
    if (queryParams['status']) {
      filtered = filtered.filter((u) => u.status === queryParams['status']);
    }

    // Apply sorting from URL
    if (queryParams['dateSort']) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.dateAdded).getTime();
        const dateB = new Date(b.dateAdded).getTime();
        return queryParams['dateSort'] === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      });
    }

    if (queryParams['nameSort']) {
      filtered.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (queryParams['nameSort'] === 'asc') {
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        } else {
          return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
        }
      });
    }

    return filtered;
  }

  onAddUser(): void {
    console.log('Add user');
  }

  onExportTypeChange(value: string | number | null): void {
    if (value === 'pdf') {
      console.log('Export as PDF');
    } else if (value === 'excel') {
      console.log('Export as Excel');
    }
  }

  onViewUser(userId: string): void {
    console.log('View user:', userId);
  }

  onToggleUserStatus(userId: string): void {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.status = user.status === 'Active' ? 'Inactive' : 'Active';
      console.log(
        `${user.status === 'Active' ? 'Enabled' : 'Disabled'} user:`,
        userId
      );
    }
  }

  onDeleteUser(userId: string): void {
    console.log('Delete user:', userId);
  }

  getMenuItems(user: User): ActionMenuItem[] {
    return [
      {
        label: user.status === 'Active' ? 'Disable' : 'Enable',
        action: () => this.onToggleUserStatus(user.id),
      },
      {
        label: 'View',
        action: () => this.onViewUser(user.id),
      },
      {
        label: 'Delete',
        action: () => this.onDeleteUser(user.id),
        variant: 'danger',
      },
    ];
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarUrl(user: User): string {
    if (user.avatar) {
      return user.avatar;
    }
    return '';
  }

  get hasActiveFilters(): boolean {
    const queryParams = this.route.snapshot.queryParams;
    const filterKeys = ['dateSort', 'nameSort', 'role', 'status', 'facility'];
    return filterKeys.some((key) => queryParams[key]);
  }

  clearAllFilters(): void {
    // Clear all sort and filter params
    const paramsToRemove = [
      'dateSort',
      'nameSort',
      'role',
      'status',
      'facility',
    ];
    const currentParams = { ...this.route.snapshot.queryParams };

    paramsToRemove.forEach((key) => {
      delete currentParams[key];
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
    });
  }
}
