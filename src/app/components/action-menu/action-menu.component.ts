import {
  Component,
  signal,
  computed,
  input,
  ChangeDetectionStrategy,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MoreVertical } from 'lucide-angular';

export interface ActionMenuItem {
  label: string;
  action: () => void;
  variant?: 'default' | 'danger';
  icon?: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-action-menu',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './action-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent implements OnInit, OnDestroy {
  private static openMenuInstance: ActionMenuComponent | null = null;

  items = input<ActionMenuItem[]>([]);
  rowIndex = input<number>(0);
  totalItems = input<number>(0);

  public readonly icons = {
    MoreVertical,
  };

  isOpen = signal<boolean>(false);
  dropdownPosition = signal<{ top: string; right: string } | null>(null);
  menuId = `action-menu-${Math.random().toString(36).substr(2, 9)}`;

  constructor(private elementRef: ElementRef) {}

  isMenuAbove = computed(() => {
    const total = this.totalItems();
    if (total < 3) return false;
    return this.rowIndex() >= total - 2;
  });

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    if (
      ActionMenuComponent.openMenuInstance &&
      ActionMenuComponent.openMenuInstance !== this
    ) {
      ActionMenuComponent.openMenuInstance.isOpen.set(false);
      ActionMenuComponent.openMenuInstance.dropdownPosition.set(null);
    }

    if (this.isOpen()) {
      this.isOpen.set(false);
      this.dropdownPosition.set(null);
      ActionMenuComponent.openMenuInstance = null;
    } else {
      // Calculate position for fixed positioning
      const button = this.elementRef.nativeElement.querySelector('button');
      if (button) {
        const rect = button.getBoundingClientRect();
        const menuAbove = this.isMenuAbove();

        if (menuAbove) {
          // Position above the button
          this.dropdownPosition.set({
            top: `${rect.top + window.scrollY - 8}px`,
            right: `${window.innerWidth - rect.right + window.scrollX}px`,
          });
        } else {
          // Position below the button
          this.dropdownPosition.set({
            top: `${rect.bottom + window.scrollY + 8}px`,
            right: `${window.innerWidth - rect.right + window.scrollX}px`,
          });
        }
      }

      this.isOpen.set(true);
      ActionMenuComponent.openMenuInstance = this;
    }
  }

  onItemClick(item: ActionMenuItem, event: MouseEvent): void {
    event.stopPropagation();
    if (item.disabled) {
      return;
    }
    this.isOpen.set(false);
    this.dropdownPosition.set(null);
    ActionMenuComponent.openMenuInstance = null;
    item.action();
  }

  private onDocumentClick = (event: Event): void => {
    if (ActionMenuComponent.openMenuInstance !== this) return;

    const target = event.target as HTMLElement;
    if (!target) return;

    // Check if clicking inside the button itself
    const button = this.elementRef.nativeElement.querySelector('button');
    const clickedInsideButton = button?.contains(target) || false;

    // Check if clicking inside the fixed dropdown menu using the menu ID
    const fixedMenu = document.querySelector(`[data-menu-id="${this.menuId}"]`);
    const clickedInsideFixedMenu = fixedMenu?.contains(target) || false;

    // Only keep menu open if clicking inside button or dropdown
    if (!clickedInsideButton && !clickedInsideFixedMenu) {
      this.isOpen.set(false);
      this.dropdownPosition.set(null);
      ActionMenuComponent.openMenuInstance = null;
    }
  };

  ngOnInit(): void {
    // Use capture phase to ensure we see clicks
    document.addEventListener('click', this.onDocumentClick, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick, true);
    // Clean up if this menu is open
    if (ActionMenuComponent.openMenuInstance === this) {
      ActionMenuComponent.openMenuInstance = null;
    }
  }
}
