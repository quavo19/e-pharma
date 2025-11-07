import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  effect,
} from '@angular/core';

export interface TabItem {
  label: string;
  id: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  public readonly tabs = input.required<TabItem[]>();
  public readonly defaultTab = input<string>('');
  public readonly activeTabId = signal<string>('');
  public tabChange = output<string>();

  private initialized = false;

  constructor() {
    // Initialize active tab once
    effect(() => {
      const tabs = this.tabs();
      const defaultTab = this.defaultTab();
      
      if (!this.initialized && tabs.length > 0) {
        const initialTab = defaultTab || tabs[0].id;
        this.activeTabId.set(initialTab);
        this.initialized = true;
        // Emit initial tab change
        this.tabChange.emit(initialTab);
      }
    });
  }

  protected selectTab(tabId: string): void {
    this.activeTabId.set(tabId);
    this.tabChange.emit(tabId);
  }

  protected isActive(tabId: string): boolean {
    const activeId = this.activeTabId();
    if (!activeId && this.tabs().length > 0 && !this.initialized) {
      return tabId === (this.defaultTab() || this.tabs()[0].id);
    }
    return activeId === tabId;
  }
}

