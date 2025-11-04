import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  XCircle,
  SlidersHorizontal,
  Eye,
  Trash2,
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
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { FormBuilder } from '@angular/forms';
import { GHANA_REGIONS } from '../../constants/regions';

export interface Branch {
  id: string;
  name: string;
  region: string;
  location: string;
  phoneNumber?: string;
  email?: string;
  manager?: string;
  dateCreated: string;
}

@Component({
  selector: 'app-branches',
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
    ConfirmationModalComponent,
  ],
  templateUrl: './branches.component.html',
})
export class BranchesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isFilterModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isViewBranchModalOpen = signal(false);
  isEditMode = signal(false);
  viewingBranch: Branch | null = null;
  branchToDelete: Branch | null = null;

  editBranchForm = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    region: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    location: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneNumber: new FormControl<string>(''),
    email: new FormControl<string>(''),
    manager: new FormControl<string | null>(null),
    regionSearch: new FormControl<string>(''),
    managerSearch: new FormControl<string>(''),
  });

  filterForm = this.fb.group({
    region: new FormControl<string | null>(null),
    regionSearch: new FormControl<string>(''),
  });

  public readonly icons = {
    Search,
    Plus,
    Download,
    XCircle,
    SlidersHorizontal,
    Eye,
    Trash2,
  };

  branches: Branch[] = [
    {
      id: 'BR001',
      name: 'Main Facility',
      region: 'Greater Accra',
      location: 'Circle',
      phoneNumber: '+233 24 123 4567',
      email: 'main@pharmacy.com',
      manager: 'John Mensah',
      dateCreated: '2023-01-15',
    },
    {
      id: 'BR002',
      name: 'Adenta Branch',
      region: 'Greater Accra',
      location: 'Adenta',
      phoneNumber: '+233 24 234 5678',
      email: 'adenta@pharmacy.com',
      manager: 'Sarah Osei',
      dateCreated: '2023-03-20',
    },
    {
      id: 'BR003',
      name: 'Kumasi Main',
      region: 'Ashanti',
      location: 'Kumasi',
      phoneNumber: '+233 24 345 6789',
      email: 'kumasi@pharmacy.com',
      manager: 'Kwame Asante',
      dateCreated: '2023-05-10',
    },
    {
      id: 'BR004',
      name: 'East Wing',
      region: 'Greater Accra',
      location: 'Tema',
      phoneNumber: '+233 24 456 7890',
      email: 'east@pharmacy.com',
      manager: 'Ama Bonsu',
      dateCreated: '2023-07-05',
    },
    {
      id: 'BR005',
      name: 'West Wing',
      region: 'Greater Accra',
      location: 'Dansoman',
      phoneNumber: '+233 24 567 8901',
      email: 'west@pharmacy.com',
      manager: 'Kofi Darko',
      dateCreated: '2023-09-12',
    },
  ];

  // Region options for selects
  regionOptions: SelectOption[] = GHANA_REGIONS.map((r) => ({
    id: r.id,
    name: r.name,
  }));

  // Manager options - this would typically come from an API
  managerOptions: SelectOption[] = [
    { id: 'John Mensah', name: 'John Mensah' },
    { id: 'Sarah Osei', name: 'Sarah Osei' },
    { id: 'Kwame Asante', name: 'Kwame Asante' },
    { id: 'Ama Bonsu', name: 'Ama Bonsu' },
    { id: 'Kofi Darko', name: 'Kofi Darko' },
    { id: 'Yaa Asantewaa', name: 'Yaa Asantewaa' },
    { id: 'Kojo Adjei', name: 'Kojo Adjei' },
    { id: 'Ama Mensah', name: 'Ama Mensah' },
  ];

  ngOnInit(): void {
    // Component initialization
  }

  get filteredBranches() {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    const queryParams = this.route.snapshot.queryParams;

    let filtered = [...this.branches];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(searchTerm) ||
          b.id.toLowerCase().includes(searchTerm) ||
          b.region.toLowerCase().includes(searchTerm) ||
          b.location.toLowerCase().includes(searchTerm) ||
          (b.manager && b.manager.toLowerCase().includes(searchTerm))
      );
    }

    // Apply region filter from URL
    if (queryParams['region']) {
      filtered = filtered.filter((b) => b.region === queryParams['region']);
    }

    return filtered;
  }

  onAddBranch(): void {
    this.isAddOpen = true;
  }

  onSubmitAddBranch(): void {
    if (this.addBranchForm.invalid) {
      this.addBranchForm.markAllAsTouched();
      return;
    }
    const value = this.addBranchForm.getRawValue();
    const newBranch: Branch = {
      id: `BR${String(this.branches.length + 1).padStart(3, '0')}`,
      name: value.name,
      region: value.region,
      location: value.location,
      phoneNumber: value.phoneNumber || undefined,
      email: value.email || undefined,
      manager: value.manager || undefined,
      dateCreated: new Date().toISOString().split('T')[0],
    };
    this.branches.push(newBranch);
    this.isAddOpen = false;
    this.addBranchForm.reset();
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

  onViewBranch(branchId: string): void {
    const branch = this.branches.find((b) => b.id === branchId);
    if (branch) {
      this.viewingBranch = branch;
      this.isEditMode.set(false);
      this.editBranchForm.patchValue({
        name: branch.name,
        region: branch.region,
        location: branch.location,
        phoneNumber: branch.phoneNumber || '',
        email: branch.email || '',
        manager: branch.manager || null,
      });
      this.selectedRegion = branch.region;
      this.selectedManager = branch.manager || null;
      // Disable form initially
      this.editBranchForm.disable();
      this.isViewBranchModalOpen.set(true);
    }
  }

  closeViewBranchModal(): void {
    this.isViewBranchModalOpen.set(false);
    this.isEditMode.set(false);
    this.viewingBranch = null;
    this.editBranchForm.reset();
    this.editBranchForm.disable();
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
    // Enable form for editing
    this.editBranchForm.enable();
  }

  cancelEdit(): void {
    if (this.viewingBranch) {
      // Reset form to original values
      this.editBranchForm.patchValue({
        name: this.viewingBranch.name,
        region: this.viewingBranch.region,
        location: this.viewingBranch.location,
        phoneNumber: this.viewingBranch.phoneNumber || '',
        email: this.viewingBranch.email || '',
        manager: this.viewingBranch.manager || null,
      });
      this.selectedRegion = this.viewingBranch.region;
      this.selectedManager = this.viewingBranch.manager || null;
    }
    this.isEditMode.set(false);
    // Disable form again
    this.editBranchForm.disable();
  }

  saveBranchChanges(): void {
    if (this.editBranchForm.invalid || !this.viewingBranch) {
      return;
    }

    const formValue = this.editBranchForm.value;
    const branch = this.branches.find((b) => b.id === this.viewingBranch!.id);
    if (branch) {
      branch.name = formValue.name || '';
      branch.region = formValue.region || '';
      branch.location = formValue.location || '';
      branch.phoneNumber = formValue.phoneNumber || undefined;
      branch.email = formValue.email || undefined;
      branch.manager = formValue.manager || undefined;
    }

    this.isEditMode.set(false);
    // Disable form after saving
    this.editBranchForm.disable();
    // Update viewingBranch to reflect changes
    if (this.viewingBranch) {
      this.viewingBranch = { ...this.viewingBranch, ...branch };
    }
  }

  onDeleteBranch(branchId: string): void {
    const branch = this.branches.find((b) => b.id === branchId);
    if (branch) {
      this.branchToDelete = branch;
      this.isDeleteModalOpen.set(true);
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.branchToDelete = null;
  }

  confirmDelete(): void {
    if (this.branchToDelete) {
      const index = this.branches.findIndex(
        (b) => b.id === this.branchToDelete!.id
      );
      if (index !== -1) {
        this.branches.splice(index, 1);
      }
    }
    this.closeDeleteModal();
  }

  openFilterModal(): void {
    // Load current filter values from URL params
    const queryParams = this.route.snapshot.queryParams;
    this.filterForm.patchValue({
      region: queryParams['region'] || null,
      regionSearch: '',
    });
    this.selectedFilterRegion = queryParams['region'] || null;
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal(): void {
    this.isFilterModalOpen.set(false);
  }

  onRegionFilterChange(value: string | number | null): void {
    this.selectedFilterRegion = value;
    this.filterForm.patchValue({ region: value as string | null });
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    const queryParams: any = { ...this.route.snapshot.queryParams };

    // Update query params based on form values
    if (formValue.region) {
      queryParams['region'] = formValue.region;
    } else {
      delete queryParams['region'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });

    this.closeFilterModal();
  }

  get hasActiveFilters(): boolean {
    const queryParams = this.route.snapshot.queryParams;
    const filterKeys = ['region'];
    return filterKeys.some((key) => queryParams[key]);
  }

  clearAllFilters(): void {
    const paramsToRemove = ['region'];
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
    if (this.branchToDelete) {
      return `Are you sure you want to delete the branch "${this.branchToDelete.name}"? This action cannot be undone.`;
    }
    return '';
  }

  get viewBranchModalPrimaryAction() {
    if (this.isEditMode()) {
      return {
        label: 'Save',
        variant: 'primary' as const,
        action: () => this.saveBranchChanges(),
      };
    } else {
      return {
        label: 'Edit',
        variant: 'primary' as const,
        action: () => this.enterEditMode(),
      };
    }
  }

  get viewBranchModalSecondaryAction() {
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
        action: () => this.closeViewBranchModal(),
      };
    }
  }

  isAddOpen = false;

  addBranchPrimaryAction = {
    label: 'Save',
    variant: 'primary' as const,
    action: () => this.onSubmitAddBranch(),
  };

  addBranchSecondaryAction = {
    label: 'Cancel',
    variant: 'secondary' as const,
    action: () => this.closeAdd(),
  };

  closeAdd(): void {
    this.isAddOpen = false;
  }

  // Add Branch form
  addBranchForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    region: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    location: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneNumber: new FormControl<string>(''),
    email: new FormControl<string>(''),
    manager: new FormControl<string | null>(null),
    regionSearch: new FormControl<string>(''),
    managerSearch: new FormControl<string>(''),
  });

  // Local state for selects
  selectedRegion: string | number | null = null;
  selectedManager: string | number | null = null;
  selectedFilterRegion: string | number | null = null;

  onRegionChangeInAdd(value: string | number | null): void {
    this.selectedRegion = value;
    this.addBranchForm.patchValue({
      region: (value as string) || '',
    });
  }

  onManagerChangeInAdd(value: string | number | null): void {
    this.selectedManager = value;
    this.addBranchForm.patchValue({
      manager: (value as string) || null,
    });
  }

  onRegionChangeInEdit(value: string | number | null): void {
    this.selectedRegion = value;
    this.editBranchForm.patchValue({
      region: (value as string) || '',
    });
  }

  onManagerChangeInEdit(value: string | number | null): void {
    this.selectedManager = value;
    this.editBranchForm.patchValue({
      manager: (value as string) || null,
    });
  }

  getMenuItems = (branch: { id: string }): ActionMenuItem[] => {
    return [
      {
        label: 'View',
        action: () => this.onViewBranch(branch.id),
        icon: this.icons.Eye,
      },
      {
        label: 'Delete',
        action: () => this.onDeleteBranch(branch.id),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  // Table columns configuration
  get tableColumns(): TableColumn[] {
    return [
      {
        key: 'id',
        label: 'Branch ID',
      },
      {
        key: 'name',
        label: 'Branch Name',
      },
      {
        key: 'region',
        label: 'Region',
      },
      {
        key: 'location',
        label: 'Location',
      },
      {
        key: 'manager',
        label: 'Manager',
      },
      {
        key: 'phoneNumber',
        label: 'Phone Number',
      },
    ];
  }
}
