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
import {
  LucideAngularModule,
  Search,
  Plus,
  Download,
  XCircle,
  SlidersHorizontal,
  Power,
  PowerOff,
  FilePenLine,
  Trash2,
  Eye,
  X,
  Save,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import { SelectOption } from '../../components/select/select.component';
import { SelectComponent } from '../../components/select/select.component';
import { ExportSelectComponent } from '../../components/export-select/export-select.component';
import {
  ActionMenuComponent,
  ActionMenuItem,
} from '../../components/action-menu/action-menu.component';
import {
  DataTableComponent,
  TableColumn,
} from '../../components/data-table/data-table.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
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
    SelectComponent,
    ExportSelectComponent,
    DataTableComponent,
    PopupComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isAddUserModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isStatusModalOpen = signal(false);
  isViewUserModalOpen = signal(false);
  isEditMode = signal(false);
  viewingUser: User | null = null;
  userToDelete: User | null = null;
  userToToggleStatus: User | null = null;

  filterForm = this.fb.group({
    role: new FormControl<string | null>(null),
    roleSearch: new FormControl<string>(''),
    status: new FormControl<string | null>(null),
    facility: new FormControl<string | null>(null),
    facilitySearch: new FormControl<string>(''),
  });

  addUserForm = this.fb.group({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    branch: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    branchSearch: new FormControl<string>(''),
    role: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    roleSearch: new FormControl<string>(''),
  });

  editUserForm = this.fb.group({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    branch: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    branchSearch: new FormControl<string>(''),
    role: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    roleSearch: new FormControl<string>(''),
  });

  facilityOptions: SelectOption[] = [
    { id: 'main', name: 'Main Branch' },
    { id: 'east', name: 'East Branch' },
    { id: 'west', name: 'West Branch' },
    { id: 'north', name: 'North Branch' },
  ];

  public readonly icons = {
    Search,
    Plus,
    Download,
    XCircle,
    SlidersHorizontal,
    Power,
    PowerOff,
    FilePenLine,
    Trash2,
    Eye,
    X,
    Save,
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

  // Filter options for select components

  roleOptions: SelectOption[] = [];

  statusOptions: SelectOption[] = [
    { id: 'Active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' },
  ];

  ngOnInit(): void {
    // Extract unique roles from users
    const roles = [...new Set(this.users.map((u) => u.role))];
    this.roleOptions = roles.map((role) => ({ id: role, name: role }));

    // Load initial filter values from URL params
    const queryParams = this.route.snapshot.queryParams;
    this.filterForm.patchValue({
      role: queryParams['role'] || null,
      status: queryParams['status'] || null,
      facility: queryParams['facility'] || null,
    });
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

    return filtered;
  }

  onAddUser(): void {
    this.addUserForm.reset();
    this.addUserForm.patchValue({
      branchSearch: '',
      roleSearch: '',
    });
    this.isAddUserModalOpen.set(true);
  }

  closeAddUserModal(): void {
    this.isAddUserModalOpen.set(false);
    this.addUserForm.reset();
  }

  saveUser(): void {
    if (this.addUserForm.invalid) {
      return;
    }

    const formValue = this.addUserForm.value;
    const newUser: User = {
      id: `U${String(this.users.length + 1).padStart(3, '0')}`,
      name: `${formValue.firstName} ${formValue.lastName}`,
      phone: formValue.phone || '',
      email: formValue.email || '',
      role: formValue.role || '',
      branch: formValue.branch || '',
      facility: formValue.branch || '',
      status: 'Active',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    this.users.push(newUser);
    this.closeAddUserModal();
  }

  get addUserModalPrimaryAction() {
    return {
      label: 'Create User',
      variant: 'primary' as const,
      action: () => this.saveUser(),
    };
  }

  get addUserModalSecondaryAction() {
    return {
      label: 'Cancel',
      variant: 'secondary' as const,
      action: () => this.closeAddUserModal(),
    };
  }

  onBranchChange(value: string | number | null): void {
    this.addUserForm.patchValue({ branch: value as string | null });
  }

  onRoleChangeInAddForm(value: string | number | null): void {
    this.addUserForm.patchValue({ role: value as string | null });
  }

  onExportTypeChange(value: string | number | null): void {
    if (value === 'pdf') {
      console.log('Export as PDF');
    } else if (value === 'excel') {
      console.log('Export as Excel');
    }
  }

  onViewUser(userId: string): void {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.viewingUser = user;
      this.isEditMode.set(false);
      // Split name into first and last
      const nameParts = user.name.split(' ');
      this.editUserForm.patchValue({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: user.phone,
        email: user.email || '',
        branch: user.facility,
        role: user.role,
      });
      this.isViewUserModalOpen.set(true);
    }
  }

  closeViewUserModal(): void {
    this.isViewUserModalOpen.set(false);
    this.isEditMode.set(false);
    this.viewingUser = null;
    this.editUserForm.reset();
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    if (this.viewingUser) {
      // Reset form to original values
      const nameParts = this.viewingUser.name.split(' ');
      this.editUserForm.patchValue({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: this.viewingUser.phone,
        email: this.viewingUser.email || '',
        branch: this.viewingUser.facility,
        role: this.viewingUser.role,
      });
    }
    this.isEditMode.set(false);
  }

  saveUserChanges(): void {
    if (this.editUserForm.invalid || !this.viewingUser) {
      return;
    }

    const formValue = this.editUserForm.value;
    const user = this.users.find((u) => u.id === this.viewingUser!.id);
    if (user) {
      user.name = `${formValue.firstName} ${formValue.lastName}`;
      user.phone = formValue.phone || '';
      user.email = formValue.email || '';
      user.role = formValue.role || '';
      user.branch = formValue.branch || '';
      user.facility = formValue.branch || '';
    }

    this.isEditMode.set(false);
    // Update viewingUser to reflect changes
    if (this.viewingUser) {
      this.viewingUser = { ...this.viewingUser, ...user };
    }
  }

  onBranchChangeInEdit(value: string | number | null): void {
    this.editUserForm.patchValue({ branch: value as string | null });
  }

  onRoleChangeInEdit(value: string | number | null): void {
    this.editUserForm.patchValue({ role: value as string | null });
  }

  onToggleUserStatus(userId: string): void {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.userToToggleStatus = user;
      this.isStatusModalOpen.set(true);
    }
  }

  closeStatusModal(): void {
    this.isStatusModalOpen.set(false);
    this.userToToggleStatus = null;
  }

  confirmToggleStatus(): void {
    if (this.userToToggleStatus) {
      this.userToToggleStatus.status =
        this.userToToggleStatus.status === 'Active' ? 'Inactive' : 'Active';
      console.log(
        `${
          this.userToToggleStatus.status === 'Active' ? 'Enabled' : 'Disabled'
        } user:`,
        this.userToToggleStatus.id
      );
    }
    this.closeStatusModal();
  }

  onDeleteUser(userId: string): void {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.userToDelete = user;
      this.isDeleteModalOpen.set(true);
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (this.userToDelete) {
      const index = this.users.findIndex((u) => u.id === this.userToDelete!.id);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
    }
    this.closeDeleteModal();
  }

  get statusModalPrimaryAction() {
    const variant =
      this.userToToggleStatus?.status === 'Active' ? 'danger' : 'primary';
    return {
      label:
        this.userToToggleStatus?.status === 'Active'
          ? 'Deactivate'
          : 'Activate',
      variant: variant as 'primary' | 'secondary' | 'danger',
      action: () => this.confirmToggleStatus(),
    };
  }

  get statusModalSecondaryAction() {
    return {
      label: 'Cancel',
      variant: 'secondary' as const,
      action: () => this.closeStatusModal(),
    };
  }

  get statusModalDescription(): string {
    if (this.userToToggleStatus) {
      const action =
        this.userToToggleStatus.status === 'Active' ? 'disable' : 'enable';
      return `Are you sure you want to ${action} the user "${this.userToToggleStatus.name}"?`;
    }
    return '';
  }

  get statusModalHeading(): string {
    return this.userToToggleStatus?.status === 'Active'
      ? 'Disable User'
      : 'Enable User';
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
    if (this.userToDelete) {
      return `Are you sure you want to delete the user "${this.userToDelete.name}"? This action cannot be undone.`;
    }
    return '';
  }

  get viewUserModalPrimaryAction() {
    if (this.isEditMode()) {
      return {
        label: 'Save',
        variant: 'primary' as const,
        action: () => this.saveUserChanges(),
      };
    } else {
      return {
        label: 'Edit',
        variant: 'primary' as const,
        action: () => this.enterEditMode(),
      };
    }
  }

  get viewUserModalSecondaryAction() {
    if (this.isEditMode()) {
      return {
        label: 'Cancel',
        variant: 'secondary' as const,
        action: () => this.cancelEdit(),
      };
    } else {
      return {
        label: 'Close',
        variant: 'secondary' as const,
        action: () => this.closeViewUserModal(),
      };
    }
  }

  getMenuItems = (user: User): ActionMenuItem[] => {
    return [
      {
        label: user.status === 'Active' ? 'Deactivate' : 'Activate',
        action: () => this.onToggleUserStatus(user.id),
        icon: user.status === 'Active' ? this.icons.PowerOff : this.icons.Power,
      },
      {
        label: 'View',
        action: () => this.onViewUser(user.id),
        icon: this.icons.Eye,
      },
      {
        label: 'Delete',
        action: () => this.onDeleteUser(user.id),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

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
    const filterKeys = ['role', 'status', 'facility'];
    return filterKeys.some((key) => queryParams[key]);
  }

  clearAllFilters(): void {
    // Clear all filter params
    const paramsToRemove = ['role', 'status', 'facility'];
    const currentParams = { ...this.route.snapshot.queryParams };

    paramsToRemove.forEach((key) => {
      delete currentParams[key];
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
    });

    // Reset form
    this.filterForm.reset();
  }

  openFilterModal(): void {
    // Load current filter values from URL params
    const queryParams = this.route.snapshot.queryParams;
    this.filterForm.patchValue({
      role: queryParams['role'] || null,
      status: queryParams['status'] || null,
      facility: queryParams['facility'] || null,
      roleSearch: '', // Reset search field
      facilitySearch: '', // Reset search field
    });
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
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

  onRoleChange(value: string | number | null): void {
    this.filterForm.patchValue({ role: value as string | null });
  }

  onFacilityChange(value: string | number | null): void {
    this.filterForm.patchValue({ facility: value as string | null });
  }

  onStatusChange(value: string | number | null): void {
    this.filterForm.patchValue({ status: value as string | null });
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    const queryParams: any = { ...this.route.snapshot.queryParams };

    // Update query params based on form values
    if (formValue.role) {
      queryParams['role'] = formValue.role;
    } else {
      delete queryParams['role'];
    }

    if (formValue.status) {
      queryParams['status'] = formValue.status;
    } else {
      delete queryParams['status'];
    }

    if (formValue.facility) {
      queryParams['facility'] = formValue.facility;
    } else {
      delete queryParams['facility'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });

    this.closeFilterModal();
  }

  @ViewChild('nameCellTemplate') nameCellTemplate?: TemplateRef<any>;
  @ViewChild('statusCellTemplate') statusCellTemplate?: TemplateRef<any>;

  tableColumns = signal<TableColumn[]>([]);

  ngAfterViewInit(): void {
    // Initialize columns after view init so templates are available
    // Remove headerDropdown from all columns
    this.tableColumns.set([
      {
        key: 'dateAdded',
        label: 'Date Added',
      },
      {
        key: 'name',
        label: 'Name',
        cellTemplate: this.nameCellTemplate,
      },
      {
        key: 'role',
        label: 'Role',
      },
      {
        key: 'branch',
        label: 'Branch',
      },
      {
        key: 'status',
        label: 'Status',
        cellTemplate: this.statusCellTemplate,
      },
    ]);
  }
}
