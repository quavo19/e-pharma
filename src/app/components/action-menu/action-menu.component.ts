import {
  Component,
  HostListener,
  signal,
  computed,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MoreVertical } from 'lucide-angular';

export interface ActionMenuItem {
  label: string;
  action: () => void;
  variant?: 'default' | 'danger';
}

@Component({
  selector: 'app-action-menu',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './action-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent {
  items = input<ActionMenuItem[]>([]);
  rowIndex = input<number>(0);
  totalItems = input<number>(0);

  public readonly icons = {
    MoreVertical,
  };

  isOpen = signal<boolean>(false);

  isMenuAbove = computed(() => {
    const total = this.totalItems();
    if (total < 3) return false;
    return this.rowIndex() >= total - 3;
  });

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.update((value) => !value);
  }

  onItemClick(item: ActionMenuItem, event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.set(false);
    item.action();
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.isOpen.set(false);
  }
}
