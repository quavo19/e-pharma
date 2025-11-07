import { Component, signal } from '@angular/core';
import {
  LucideAngularModule,
  Home,
  FileText,
  Users,
  Package,
  NotebookPen,
  LogOut,
  CreditCard,
  Layers,
  RotateCcw,
  BarChart3,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  ShoppingCart,
  Store,
  FlaskConical,
  Warehouse,
  Pill,
  Truck,
  Settings,
} from 'lucide-angular';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

interface NavigationItem {
  label: string;
  icon: any;
  route?: string;
  children?: NavigationItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  public readonly icons = {
    Home,
    FileText,
    Users,
    Package,
    NotebookPen,
    LogOut,
    CreditCard,
    Layers,
    RotateCcw,
    BarChart3,
    ChevronDown,
    PanelLeftClose,
    PanelLeftOpen,
    Shield,
    ShoppingCart,
    Store,
    FlaskConical,
    Warehouse,
    Pill,
    Truck,
    Settings,
  };
  public currentRoute: string = '';
  isUserManagementOpen = signal(false);
  isInventoryOpen = signal(false);
  private readonly SIDEBAR_COLLAPSED_KEY = 'sidebarCollapsed';
  
  // Initialize collapsed state from localStorage
  isCollapsed = signal(false);
  
  private loadCollapsedState(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const saved = localStorage.getItem(this.SIDEBAR_COLLAPSED_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  }

  public readonly navigationItems: NavigationItem[] = [
    { label: 'Dashboard', icon: this.icons.Home, route: '/' },
    {
      label: 'Inventory',
      icon: this.icons.Package,
      children: [
        { label: 'Products', icon: this.icons.Package, route: '/products' },
        {
          label: 'Drug Classes',
          icon: this.icons.FlaskConical,
          route: '/drug-classes',
        },
        { label: 'Shelves', icon: this.icons.Warehouse, route: '/shelves' },
        {
          label: 'Dosage Forms',
          icon: this.icons.Pill,
          route: '/dosage-forms',
        },
        {
          label: 'Sales',
          icon: this.icons.ShoppingCart,
          route: '/sales',
        },
        {
          label: 'Suppliers',
          icon: this.icons.Truck,
          route: '/suppliers',
        },
      ],
    },
    { label: 'Audit Logs', icon: this.icons.NotebookPen, route: '/audit-logs' },
    { label: 'POS', icon: this.icons.CreditCard, route: '/POS' },
    { label: 'Batches', icon: this.icons.Layers, route: '/batches' },
    { label: 'Branches', icon: this.icons.Store, route: '/branches' },
    {
      label: 'User Management',
      icon: this.icons.Users,
      children: [
        { label: 'Users', icon: this.icons.Users, route: '/users' },
        { label: 'Roles', icon: this.icons.Shield, route: '/roles' },
      ],
    },
    { label: 'Settings', icon: this.icons.Settings, route: '/settings' },
    { label: 'Reports', icon: this.icons.BarChart3, route: '/logout' },
  ];

  constructor(private router: Router) {
    // Load collapsed state from localStorage
    this.isCollapsed.set(this.loadCollapsedState());
    
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = this.stripUrl(event.urlAfterRedirects || event.url);
        // Auto-expand User Management if on users or roles route
        if (this.currentRoute === '/users' || this.currentRoute === '/roles') {
          this.isUserManagementOpen.set(true);
        }
        // Auto-expand Inventory if on inventory-related routes
        if (
          this.currentRoute === '/products' ||
          this.currentRoute === '/drug-classes' ||
          this.currentRoute === '/shelves' ||
          this.currentRoute === '/dosage-forms' ||
          this.currentRoute === '/sales' ||
          this.currentRoute === '/suppliers' ||
          this.currentRoute.startsWith('/suppliers/')
        ) {
          this.isInventoryOpen.set(true);
        }
      });
    this.currentRoute = this.stripUrl(this.router.url);
    // Auto-expand User Management if on users or roles route
    if (this.currentRoute === '/users' || this.currentRoute === '/roles') {
      this.isUserManagementOpen.set(true);
    }
    // Auto-expand Inventory if on inventory-related routes
    if (
      this.currentRoute === '/products' ||
      this.currentRoute === '/drug-classes' ||
      this.currentRoute === '/shelves' ||
      this.currentRoute === '/dosage-forms' ||
      this.currentRoute === '/sales' ||
      this.currentRoute === '/suppliers' ||
      this.currentRoute.startsWith('/suppliers/')
    ) {
      this.isInventoryOpen.set(true);
    }
  }

  isActiveRoute(route: string): boolean {
    const current = this.currentRoute;
    if (route === '/') {
      return current === '/';
    }
    return current.startsWith(route);
  }

  isParentItemActive(item: NavigationItem): boolean {
    if (!item.children || item.children.length === 0) {
      return this.isActiveRoute(item.route || '');
    }
    return item.children.some((child) => this.isActiveRoute(child.route || ''));
  }

  toggleUserManagement(): void {
    this.isUserManagementOpen.set(!this.isUserManagementOpen());
  }

  toggleInventory(): void {
    this.isInventoryOpen.set(!this.isInventoryOpen());
  }

  isUserManagementActive(): boolean {
    return this.currentRoute === '/users' || this.currentRoute === '/roles';
  }

  isInventoryActive(): boolean {
    return (
      this.currentRoute === '/products' ||
      this.currentRoute === '/drug-classes' ||
      this.currentRoute === '/shelves' ||
      this.currentRoute === '/dosage-forms' ||
      this.currentRoute === '/sales' ||
      this.currentRoute === '/suppliers' ||
      this.currentRoute.startsWith('/suppliers/')
    );
  }

  private stripUrl(url: string): string {
    if (!url) return '/';
    const path = url.split('#')[0].split('?')[0];
    return path || '/';
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  private saveCollapsedState(collapsed: boolean): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      localStorage.setItem(this.SIDEBAR_COLLAPSED_KEY, String(collapsed));
    } catch {
      // Ignore localStorage errors
    }
  }

  toggleCollapse(): void {
    const newState = !this.isCollapsed();
    this.isCollapsed.set(newState);
    this.saveCollapsedState(newState);
    // Close sub-menus when collapsing
    if (newState) {
      this.isUserManagementOpen.set(false);
      this.isInventoryOpen.set(false);
    }
  }

}
