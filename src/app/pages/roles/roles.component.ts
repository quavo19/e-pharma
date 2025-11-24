import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  signal,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  Plus,
  Download,
  XCircle,
  FilePenLine,
  Trash2,
  Shield,
  Power,
  PowerOff,
} from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import { SelectOption } from '../../components/select/select.component';
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
import { CheckboxComponent } from '../../components/custom-checkbox/custom-checkbox.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
  status: 'Active' | 'Inactive';
  dateCreated: string;
  dateModified: string;
}

export interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-roles',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    DataTableComponent,
    PopupComponent,
    CheckboxComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isRoleModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isStatusModalOpen = signal(false);
  editingRole: Role | null = null;
  roleToDelete: Role | null = null;
  roleToToggleStatus: Role | null = null;

  // Available permissions
  permissions: Permission[] = [
    {
      id: 'users.view',
      name: 'View Users',
      category: 'Users',
      description: 'View user list',
    },
    {
      id: 'users.create',
      name: 'Create Users',
      category: 'Users',
      description: 'Create new users',
    },
    {
      id: 'users.edit',
      name: 'Edit Users',
      category: 'Users',
      description: 'Edit existing users',
    },
    {
      id: 'users.delete',
      name: 'Delete Users',
      category: 'Users',
      description: 'Delete users',
    },
    {
      id: 'products.view',
      name: 'View Products',
      category: 'Products',
      description: 'View product list',
    },
    {
      id: 'products.create',
      name: 'Create Products',
      category: 'Products',
      description: 'Create new products',
    },
    {
      id: 'products.edit',
      name: 'Edit Products',
      category: 'Products',
      description: 'Edit existing products',
    },
    {
      id: 'products.delete',
      name: 'Delete Products',
      category: 'Products',
      description: 'Delete products',
    },
    {
      id: 'reports.view',
      name: 'View Reports',
      category: 'Reports',
      description: 'View reports',
    },
    {
      id: 'reports.export',
      name: 'Export Reports',
      category: 'Reports',
      description: 'Export reports',
    },
    {
      id: 'settings.view',
      name: 'View Settings',
      category: 'Settings',
      description: 'View settings',
    },
    {
      id: 'settings.edit',
      name: 'Edit Settings',
      category: 'Settings',
      description: 'Edit settings',
    },
    {
      id: 'roles.view',
      name: 'View Roles',
      category: 'Roles',
      description: 'View role list',
    },
    {
      id: 'roles.create',
      name: 'Create Roles',
      category: 'Roles',
      description: 'Create new roles',
    },
    {
      id: 'roles.edit',
      name: 'Edit Roles',
      category: 'Roles',
      description: 'Edit existing roles',
    },
    {
      id: 'roles.delete',
      name: 'Delete Roles',
      category: 'Roles',
      description: 'Delete roles',
    },
  ];

  roles: Role[] = [
    {
      id: 'R001',
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: this.permissions.map((p) => p.id),
      usersCount: 3,
      status: 'Active',
      dateCreated: '2024-01-15',
      dateModified: '2024-01-15',
    },
    {
      id: 'R002',
      name: 'Manager',
      description: 'Management access with view and edit permissions',
      permissions: [
        'users.view',
        'users.edit',
        'products.view',
        'products.edit',
        'reports.view',
        'reports.export',
      ],
      usersCount: 5,
      status: 'Active',
      dateCreated: '2024-01-20',
      dateModified: '2024-02-10',
    },
    {
      id: 'R003',
      name: 'Pharmacist',
      description: 'Product and inventory management',
      permissions: [
        'products.view',
        'products.create',
        'products.edit',
        'reports.view',
      ],
      usersCount: 8,
      status: 'Active',
      dateCreated: '2024-01-25',
      dateModified: '2024-03-15',
    },
    {
      id: 'R004',
      name: 'Nurse',
      description: 'View-only access to products and reports',
      permissions: ['products.view', 'reports.view'],
      usersCount: 12,
      status: 'Inactive',
      dateCreated: '2024-02-01',
      dateModified: '2024-02-01',
    },
  ];

  exportOptions: SelectOption[] = [
    { id: 'pdf', name: 'PDF' },
    { id: 'excel', name: 'Excel' },
  ];

  public readonly icons = {
    Search,
    Plus,
    Download,
    XCircle,
    FilePenLine,
    Trash2,
    Shield,
    Power,
    PowerOff,
  };

  roleForm = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
    }),
  });

  // Permission form controls
  permissionControls: Map<string, FormControl> = new Map();

  ngOnInit(): void {
    // Initialize permission controls
    this.permissions.forEach((permission) => {
      this.permissionControls.set(
        permission.id,
        new FormControl<boolean>(false)
      );
    });
  }

  get filteredRoles() {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    if (!searchTerm) {
      return this.roles;
    }
    return this.roles.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm) ||
        r.description.toLowerCase().includes(searchTerm) ||
        r.id.toLowerCase().includes(searchTerm)
    );
  }

  onAddRole(): void {
    this.editingRole = null;
    this.roleForm.reset();
    // Reset all permission controls
    this.permissionControls.forEach((control) => control.setValue(false));
    this.isRoleModalOpen.set(true);
  }

  onEditRole(role: Role): void {
    this.editingRole = role;
    this.roleForm.patchValue({
      name: role.name,
      description: role.description,
    });
    // Set permission controls based on role
    this.permissionControls.forEach((control, permissionId) => {
      control.setValue(role.permissions.includes(permissionId));
    });
    this.isRoleModalOpen.set(true);
  }

  onDeleteRole(role: Role): void {
    this.roleToDelete = role;
    this.isDeleteModalOpen.set(true);
  }

  closeRoleModal(): void {
    this.isRoleModalOpen.set(false);
    this.editingRole = null;
    this.roleForm.reset();
    this.permissionControls.forEach((control) => control.setValue(false));
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.roleToDelete = null;
  }

  get roleModalPrimaryAction() {
    return {
      label: this.editingRole ? 'Update Role' : 'Create Role',
      variant: 'primary' as const,
      action: () => this.saveRole(),
    };
  }

  get roleModalSecondaryAction() {
    return {
      label: 'Cancel',
      variant: 'secondary' as const,
      action: () => this.closeRoleModal(),
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
    if (this.roleToDelete) {
      return `Are you sure you want to delete the role "${this.roleToDelete.name}"? This role is assigned to ${this.roleToDelete.usersCount} user(s). Deleting this role will remove it from all users. This action cannot be undone.`;
    }
    return '';
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      return;
    }

    const formValue = this.roleForm.value;
    const selectedPermissions = Array.from(this.permissionControls.entries())
      .filter(([_, control]) => control.value === true)
      .map(([permissionId]) => permissionId);

    if (this.editingRole) {
      // Update existing role
      const index = this.roles.findIndex((r) => r.id === this.editingRole!.id);
      if (index !== -1) {
        this.roles[index] = {
          ...this.roles[index],
          name: formValue.name || '',
          description: formValue.description || '',
          permissions: selectedPermissions,
          dateModified: new Date().toISOString().split('T')[0],
        };
      }
    } else {
      // Create new role
      const newRole: Role = {
        id: `R${String(this.roles.length + 1).padStart(3, '0')}`,
        name: formValue.name || '',
        description: formValue.description || '',
        permissions: selectedPermissions,
        usersCount: 0,
        status: 'Active',
        dateCreated: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
      };
      this.roles.push(newRole);
    }

    this.closeRoleModal();
  }

  confirmDelete(): void {
    if (this.roleToDelete) {
      const index = this.roles.findIndex((r) => r.id === this.roleToDelete!.id);
      if (index !== -1) {
        this.roles.splice(index, 1);
      }
    }
    this.closeDeleteModal();
  }

  onToggleRoleStatus(roleId: string): void {
    const role = this.roles.find((r) => r.id === roleId);
    if (role) {
      this.roleToToggleStatus = role;
      this.isStatusModalOpen.set(true);
    }
  }

  closeStatusModal(): void {
    this.isStatusModalOpen.set(false);
    this.roleToToggleStatus = null;
  }

  confirmToggleStatus(): void {
    if (this.roleToToggleStatus) {
      this.roleToToggleStatus.status =
        this.roleToToggleStatus.status === 'Active' ? 'Inactive' : 'Active';
      this.roleToToggleStatus.dateModified = new Date()
        .toISOString()
        .split('T')[0];
      console.log(
        `${
          this.roleToToggleStatus.status === 'Active'
            ? 'Activated'
            : 'Deactivated'
        } role:`,
        this.roleToToggleStatus.id
      );
    }
    this.closeStatusModal();
  }

  get statusModalPrimaryAction() {
    const variant =
      this.roleToToggleStatus?.status === 'Active' ? 'danger' : 'primary';
    return {
      label:
        this.roleToToggleStatus?.status === 'Active'
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
    if (this.roleToToggleStatus) {
      const action =
        this.roleToToggleStatus.status === 'Active' ? 'deactivate' : 'activate';
      return `Are you sure you want to ${action} the role "${this.roleToToggleStatus.name}"? This role is assigned to ${this.roleToToggleStatus.usersCount} user(s).`;
    }
    return '';
  }

  get statusModalHeading(): string {
    return this.roleToToggleStatus?.status === 'Active'
      ? 'Deactivate Role'
      : 'Activate Role';
  }

  onExportTypeChange(value: string | number | null): void {
    if (value === 'pdf') {
      console.log('Export roles as PDF');
    } else if (value === 'excel') {
      console.log('Export roles as Excel');
    }
  }

  getPermissionName(permissionId: string): string {
    const permission = this.permissions.find((p) => p.id === permissionId);
    return permission?.name || permissionId;
  }

  getDeleteMessage(): string {
    if (this.roleToDelete) {
      return `Are you sure you want to delete the role "${this.roleToDelete.name}"? This action cannot be undone.`;
    }
    return '';
  }

  getMenuItems = (role: Role): ActionMenuItem[] => {
    return [
      {
        label: role.status === 'Active' ? 'Deactivate' : 'Activate',
        action: () => this.onToggleRoleStatus(role.id),
        icon: role.status === 'Active' ? this.icons.PowerOff : this.icons.Power,
      },
      {
        label: 'Edit',
        action: () => this.onEditRole(role),
        icon: this.icons.FilePenLine,
      },
      {
        label: 'Delete',
        action: () => this.onDeleteRole(role),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  @ViewChild('statusCellTemplate') statusCellTemplate?: TemplateRef<any>;

  tableColumns = signal<TableColumn[]>([]);

  ngAfterViewInit(): void {
    this.tableColumns.set([
      {
        key: 'name',
        label: 'Role Name',
      },
      {
        key: 'usersCount',
        label: 'Users',
      },
      {
        key: 'dateModified',
        label: 'Last Modified',
      },
      {
        key: 'status',
        label: 'Status',
        cellTemplate: this.statusCellTemplate,
      },
    ]);
  }
}
