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
import { LucideAngularModule, Search, Plus, Eye, Trash2 } from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
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

export interface DrugClass {
  id: string;
  name: string;
  description?: string;
  dateCreated: string;
}

@Component({
  selector: 'app-drug-classes',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    DataTableComponent,
    PopupComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './drug-classes.component.html',
})
export class DrugClassesComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isAddModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isViewModalOpen = signal(false);
  isEditMode = signal(false);
  viewingDrugClass: DrugClass | null = null;
  drugClassToDelete: DrugClass | null = null;

  drugClassForm = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>(''),
  });

  drugClasses: DrugClass[] = [
    {
      id: 'DC001',
      name: 'Pain Killer',
      description: 'Medications for pain relief',
      dateCreated: '2024-01-15',
    },
    {
      id: 'DC002',
      name: 'Antibiotic',
      description: 'Medications to treat bacterial infections',
      dateCreated: '2024-01-20',
    },
    {
      id: 'DC003',
      name: 'Antipyretic',
      description: 'Medications to reduce fever',
      dateCreated: '2024-02-01',
    },
    {
      id: 'DC004',
      name: 'Antimalarial',
      description: 'Medications to prevent and treat malaria',
      dateCreated: '2024-02-15',
    },
  ];

  public readonly icons = {
    Search,
    Plus,
    Eye,
    Trash2,
  };

  tableColumns = signal<TableColumn[]>([]);

  @ViewChild('nameCellTemplate') nameCellTemplate?: TemplateRef<any>;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.tableColumns.set([
      {
        key: 'name',
        label: 'Name',
        cellTemplate: this.nameCellTemplate,
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'dateCreated',
        label: 'Date Created',
      },
    ]);
  }

  get filteredDrugClasses(): DrugClass[] {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    if (!searchTerm) return this.drugClasses;

    return this.drugClasses.filter(
      (dc) =>
        dc.name.toLowerCase().includes(searchTerm) ||
        dc.description?.toLowerCase().includes(searchTerm)
    );
  }

  onAddDrugClass(): void {
    this.drugClassForm.reset();
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
    this.drugClassForm.reset();
  }

  saveDrugClass(): void {
    if (this.drugClassForm.invalid) {
      this.drugClassForm.markAllAsTouched();
      return;
    }

    const formValue = this.drugClassForm.value;
    const newDrugClass: DrugClass = {
      id: `DC${String(this.drugClasses.length + 1).padStart(3, '0')}`,
      name: formValue.name || '',
      description: formValue.description || '',
      dateCreated: new Date().toISOString().split('T')[0],
    };

    this.drugClasses.push(newDrugClass);
    this.closeAddModal();
  }

  onViewDrugClass(drugClassId: string): void {
    const drugClass = this.drugClasses.find((dc) => dc.id === drugClassId);
    if (drugClass) {
      this.viewingDrugClass = drugClass;
      this.isEditMode.set(false);
      this.drugClassForm.patchValue({
        name: drugClass.name,
        description: drugClass.description || '',
      });
      this.isViewModalOpen.set(true);
    }
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.isEditMode.set(false);
    this.viewingDrugClass = null;
    this.drugClassForm.reset();
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    if (this.viewingDrugClass) {
      this.drugClassForm.patchValue({
        name: this.viewingDrugClass.name,
        description: this.viewingDrugClass.description || '',
      });
    }
    this.isEditMode.set(false);
  }

  saveDrugClassChanges(): void {
    if (this.drugClassForm.invalid || !this.viewingDrugClass) {
      return;
    }

    const formValue = this.drugClassForm.value;
    const drugClass = this.drugClasses.find(
      (dc) => dc.id === this.viewingDrugClass!.id
    );
    if (drugClass) {
      drugClass.name = formValue.name || '';
      drugClass.description = formValue.description || '';
    }

    this.isEditMode.set(false);
    if (this.viewingDrugClass) {
      this.viewingDrugClass = { ...this.viewingDrugClass, ...drugClass };
    }
  }

  onDeleteDrugClass(drugClassId: string): void {
    const drugClass = this.drugClasses.find((dc) => dc.id === drugClassId);
    if (drugClass) {
      this.drugClassToDelete = drugClass;
      this.isDeleteModalOpen.set(true);
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.drugClassToDelete = null;
  }

  confirmDelete(): void {
    if (this.drugClassToDelete) {
      const index = this.drugClasses.findIndex(
        (dc) => dc.id === this.drugClassToDelete!.id
      );
      if (index !== -1) {
        this.drugClasses.splice(index, 1);
      }
    }
    this.closeDeleteModal();
  }

  getMenuItems = (drugClass: DrugClass): ActionMenuItem[] => {
    return [
      {
        label: 'View',
        action: () => this.onViewDrugClass(drugClass.id),
        icon: this.icons.Eye,
      },
      {
        label: 'Delete',
        action: () => this.onDeleteDrugClass(drugClass.id),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  get addModalPrimaryAction() {
    return {
      label: 'Save',
      variant: 'primary' as const,
      action: () => this.saveDrugClass(),
    };
  }

  get addModalSecondaryAction() {
    return {
      label: 'Cancel',
      variant: 'secondary' as const,
      action: () => this.closeAddModal(),
    };
  }

  get viewModalPrimaryAction() {
    if (this.isEditMode()) {
      return {
        label: 'Save',
        variant: 'primary' as const,
        action: () => this.saveDrugClassChanges(),
      };
    } else {
      return {
        label: 'Edit',
        variant: 'primary' as const,
        action: () => this.enterEditMode(),
      };
    }
  }

  get viewModalSecondaryAction() {
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
        action: () => this.closeViewModal(),
      };
    }
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
    if (this.drugClassToDelete) {
      return `Are you sure you want to delete the drug class "${this.drugClassToDelete.name}"? This action cannot be undone.`;
    }
    return '';
  }
}
