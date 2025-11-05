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
  Shield,
  ShoppingCart,
  Store,
  FlaskConical,
  Warehouse,
  Pill,
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
    Shield,
    ShoppingCart,
    Store,
    FlaskConical,
    Warehouse,
    Pill,
  };
  public currentRoute: string = '';
  isUserManagementOpen = signal(false);
  isInventoryOpen = signal(false);

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
    { label: 'Refunds', icon: this.icons.RotateCcw, route: '/settings' },
    { label: 'Reports', icon: this.icons.BarChart3, route: '/logout' },
  ];

  constructor(private router: Router) {
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
          this.currentRoute === '/sales'
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
      this.currentRoute === '/sales'
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
      this.currentRoute === '/sales'
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
}
