import { Component } from '@angular/core';
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
} from 'lucide-angular';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

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
  };
  public currentRoute: string = '';

  public readonly navigationItems = [
    { label: 'Dashboard', icon: this.icons.Home, route: '/' },
    { label: 'Products', icon: this.icons.Package, route: '/products' },
    { label: 'Audit Logs', icon: this.icons.NotebookPen, route: '/audit-logs' },
    { label: 'POS', icon: this.icons.CreditCard, route: '/POS' },
    { label: 'Batches', icon: this.icons.Layers, route: '/batches' },
    { label: 'Users', icon: this.icons.Users, route: '/users' },
    { label: 'Refunds', icon: this.icons.RotateCcw, route: '/settings' },
    { label: 'Reports', icon: this.icons.BarChart3, route: '/logout' },
  ];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
    this.currentRoute = this.router.url;
  }

  isActiveRoute(route: string): boolean {
    if (route === '/') {
      return this.currentRoute === '/';
    }
    return this.currentRoute.startsWith(route);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
