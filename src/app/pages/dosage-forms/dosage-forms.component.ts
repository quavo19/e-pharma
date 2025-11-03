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

export interface DosageForm {
  id: string;
  name: string;
  description?: string;
  dateCreated: string;
}

@Component({
  selector: 'app-dosage-forms',
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
  templateUrl: './dosage-forms.component.html',
})
export class DosageFormsComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isAddModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isViewModalOpen = signal(false);
  isEditMode = signal(false);
  viewingDosageForm: DosageForm | null = null;
  dosageFormToDelete: DosageForm | null = null;

  dosageFormForm = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>(''),
  });

  dosageForms: DosageForm[] = [
    {
      id: 'DF001',
      name: 'Tablet',
      description: 'Solid oral dosage form',
      dateCreated: '2024-01-15',
    },
    {
      id: 'DF002',
      name: 'Capsule',
      description: 'Gelatin shell containing medication',
      dateCreated: '2024-01-20',
    },
    {
      id: 'DF003',
      name: 'Syrup',
      description: 'Liquid oral medication',
      dateCreated: '2024-02-01',
    },
    {
      id: 'DF004',
      name: 'Injection',
      description: 'Parenteral medication',
      dateCreated: '2024-02-15',
    },
    {
      id: 'DF005',
      name: 'Ointment',
      description: 'Topical medication',
      dateCreated: '2024-03-01',
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

  get filteredDosageForms(): DosageForm[] {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    if (!searchTerm) return this.dosageForms;

    return this.dosageForms.filter(
      (df) =>
        df.name.toLowerCase().includes(searchTerm) ||
        df.description?.toLowerCase().includes(searchTerm)
    );
  }

  onAddDosageForm(): void {
    this.dosageFormForm.reset();
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
    this.dosageFormForm.reset();
  }

  saveDosageForm(): void {
    if (this.dosageFormForm.invalid) {
      this.dosageFormForm.markAllAsTouched();
      return;
    }

    const formValue = this.dosageFormForm.value;
    const newDosageForm: DosageForm = {
      id: `DF${String(this.dosageForms.length + 1).padStart(3, '0')}`,
      name: formValue.name || '',
      description: formValue.description || '',
      dateCreated: new Date().toISOString().split('T')[0],
    };

    this.dosageForms.push(newDosageForm);
    this.closeAddModal();
  }

  onViewDosageForm(dosageFormId: string): void {
    const dosageForm = this.dosageForms.find((df) => df.id === dosageFormId);
    if (dosageForm) {
      this.viewingDosageForm = dosageForm;
      this.isEditMode.set(false);
      this.dosageFormForm.patchValue({
        name: dosageForm.name,
        description: dosageForm.description || '',
      });
      this.isViewModalOpen.set(true);
    }
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.isEditMode.set(false);
    this.viewingDosageForm = null;
    this.dosageFormForm.reset();
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    if (this.viewingDosageForm) {
      this.dosageFormForm.patchValue({
        name: this.viewingDosageForm.name,
        description: this.viewingDosageForm.description || '',
      });
    }
    this.isEditMode.set(false);
  }

  saveDosageFormChanges(): void {
    if (this.dosageFormForm.invalid || !this.viewingDosageForm) {
      return;
    }

    const formValue = this.dosageFormForm.value;
    const dosageForm = this.dosageForms.find(
      (df) => df.id === this.viewingDosageForm!.id
    );
    if (dosageForm) {
      dosageForm.name = formValue.name || '';
      dosageForm.description = formValue.description || '';
    }

    this.isEditMode.set(false);
    if (this.viewingDosageForm) {
      this.viewingDosageForm = { ...this.viewingDosageForm, ...dosageForm };
    }
  }

  onDeleteDosageForm(dosageFormId: string): void {
    const dosageForm = this.dosageForms.find((df) => df.id === dosageFormId);
    if (dosageForm) {
      this.dosageFormToDelete = dosageForm;
      this.isDeleteModalOpen.set(true);
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.dosageFormToDelete = null;
  }

  confirmDelete(): void {
    if (this.dosageFormToDelete) {
      const index = this.dosageForms.findIndex(
        (df) => df.id === this.dosageFormToDelete!.id
      );
      if (index !== -1) {
        this.dosageForms.splice(index, 1);
      }
    }
    this.closeDeleteModal();
  }

  getMenuItems = (dosageForm: DosageForm): ActionMenuItem[] => {
    return [
      {
        label: 'View',
        action: () => this.onViewDosageForm(dosageForm.id),
        icon: this.icons.Eye,
      },
      {
        label: 'Delete',
        action: () => this.onDeleteDosageForm(dosageForm.id),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  get addModalPrimaryAction() {
    return {
      label: 'Save',
      variant: 'primary' as const,
      action: () => this.saveDosageForm(),
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
        action: () => this.saveDosageFormChanges(),
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
    if (this.dosageFormToDelete) {
      return `Are you sure you want to delete the dosage form "${this.dosageFormToDelete.name}"? This action cannot be undone.`;
    }
    return '';
  }
}
