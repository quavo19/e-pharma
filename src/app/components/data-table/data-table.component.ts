import { Component, input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TableHeaderDropdownComponent,
  TableHeaderDropdownOption,
} from '../table-header-dropdown/table-header-dropdown.component';
import {
  ActionMenuComponent,
  ActionMenuItem,
} from '../action-menu/action-menu.component';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  headerDropdown?: {
    options: TableHeaderDropdownOption[];
    queryParamKey: string;
    clearLabel?: string;
    enableSearch?: boolean;
    dropdownWidth?: string;
  };
  cellTemplate?: TemplateRef<{ $implicit: T; index: number }>;
}

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, TableHeaderDropdownComponent, ActionMenuComponent],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent<T = any> {
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  getActionMenuItems = input<(item: T, index: number) => ActionMenuItem[]>();
  trackBy = input<(index: number, item: T) => any>((index, item) => index);
  onRowClick = input<(item: T, index: number) => void>();

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  get totalColumns(): number {
    // Count: # column + all data columns + action column (if present)
    return 1 + this.columns().length + (this.getActionMenuItems() ? 1 : 0);
  }
}
