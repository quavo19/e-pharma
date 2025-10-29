import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-angular';
import { DashboardHeadingComponent } from '../dashboard-heading/dashboard-heading.component';

@Component({
  selector: 'app-dashboard-cards',
  imports: [CommonModule, LucideAngularModule, DashboardHeadingComponent],
  templateUrl: './dashboard-cards.component.html',
})
export class DashboardCardsComponent {
  public readonly icons = {
    ShoppingCart,
    Users,
    DollarSign,
    Clock,
    AlertTriangle,
    XCircle,
    TrendingUp,
    TrendingDown,
  };

  public readonly cards = signal([
    {
      title: 'Total No of Purchases',
      value: '1,234',
      icon: this.icons.ShoppingCart,
    },
    {
      title: 'Total Customers',
      value: '856',
      icon: this.icons.Users,
    },
    {
      title: 'Total Sales (GH₵)',
      value: '₵45,678',
      icon: this.icons.DollarSign,
    },
    {
      title: 'Nearing Expiry',
      value: '23',
      icon: this.icons.Clock,
    },
    {
      title: 'Low Stock',
      value: '12',
      icon: this.icons.AlertTriangle,
    },
    {
      title: 'Out of Stock',
      value: '5',
      icon: this.icons.XCircle,
    },
  ]);
}
