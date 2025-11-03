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

export interface Shelve {
  id: string;
  name: string;
  location?: string;
  dateCreated: string;
}

@Component({
  selector: 'app-shelves',
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
  templateUrl: './shelves.component.html',
})
export class ShelvesComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);

  searchControl = new FormControl('');
  isAddModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isViewModalOpen = signal(false);
  isEditMode = signal(false);
  viewingShelve: Shelve | null = null;
  shelveToDelete: Shelve | null = null;

  shelveForm = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    location: new FormControl<string>(''),
  });

  shelves: Shelve[] = [
    {
      id: 'S001',
      name: 'AMA',
      location: 'Section A',
      dateCreated: '2024-01-15',
    },
    {
      id: 'S002',
      name: 'BMB',
      location: 'Section B',
      dateCreated: '2024-01-20',
    },
    {
      id: 'S003',
      name: 'CMC',
      location: 'Section C',
      dateCreated: '2024-02-01',
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
        key: 'location',
        label: 'Location',
      },
      {
        key: 'dateCreated',
        label: 'Date Created',
      },
    ]);
  }

  get filteredShelves(): Shelve[] {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    if (!searchTerm) return this.shelves;

    return this.shelves.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm) ||
        s.location?.toLowerCase().includes(searchTerm)
    );
  }

  onAddShelve(): void {
    this.shelveForm.reset();
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
    this.shelveForm.reset();
  }

  saveShelve(): void {
    if (this.shelveForm.invalid) {
      this.shelveForm.markAllAsTouched();
      return;
    }

    const formValue = this.shelveForm.value;
    const newShelve: Shelve = {
      id: `S${String(this.shelves.length + 1).padStart(3, '0')}`,
      name: formValue.name || '',
      location: formValue.location || '',
      dateCreated: new Date().toISOString().split('T')[0],
    };

    this.shelves.push(newShelve);
    this.closeAddModal();
  }

  onViewShelve(shelveId: string): void {
    const shelve = this.shelves.find((s) => s.id === shelveId);
    if (shelve) {
      this.viewingShelve = shelve;
      this.isEditMode.set(false);
      this.shelveForm.patchValue({
        name: shelve.name,
        location: shelve.location || '',
      });
      this.isViewModalOpen.set(true);
    }
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.isEditMode.set(false);
    this.viewingShelve = null;
    this.shelveForm.reset();
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    if (this.viewingShelve) {
      this.shelveForm.patchValue({
        name: this.viewingShelve.name,
        location: this.viewingShelve.location || '',
      });
    }
    this.isEditMode.set(false);
  }

  saveShelveChanges(): void {
    if (this.shelveForm.invalid || !this.viewingShelve) {
      return;
    }

    const formValue = this.shelveForm.value;
    const shelve = this.shelves.find((s) => s.id === this.viewingShelve!.id);
    if (shelve) {
      shelve.name = formValue.name || '';
      shelve.location = formValue.location || '';
    }

    this.isEditMode.set(false);
    if (this.viewingShelve) {
      this.viewingShelve = { ...this.viewingShelve, ...shelve };
    }
  }

  onDeleteShelve(shelveId: string): void {
    const shelve = this.shelves.find((s) => s.id === shelveId);
    if (shelve) {
      this.shelveToDelete = shelve;
      this.isDeleteModalOpen.set(true);
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.shelveToDelete = null;
  }

  confirmDelete(): void {
    if (this.shelveToDelete) {
      const index = this.shelves.findIndex(
        (s) => s.id === this.shelveToDelete!.id
      );
      if (index !== -1) {
        this.shelves.splice(index, 1);
      }
    }
    this.closeDeleteModal();
  }

  getMenuItems = (shelve: Shelve): ActionMenuItem[] => {
    return [
      {
        label: 'View',
        action: () => this.onViewShelve(shelve.id),
        icon: this.icons.Eye,
      },
      {
        label: 'Delete',
        action: () => this.onDeleteShelve(shelve.id),
        variant: 'danger',
        icon: this.icons.Trash2,
      },
    ];
  };

  get addModalPrimaryAction() {
    return {
      label: 'Save',
      variant: 'primary' as const,
      action: () => this.saveShelve(),
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
        action: () => this.saveShelveChanges(),
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
    if (this.shelveToDelete) {
      return `Are you sure you want to delete the shelve "${this.shelveToDelete.name}"? This action cannot be undone.`;
    }
    return '';
  }
}
