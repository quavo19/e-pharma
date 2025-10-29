import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeadingComponent } from '../dashboard-heading/dashboard-heading.component';
import { LucideAngularModule, User } from 'lucide-angular';
import { TOP_SALES_DATA } from '../../constants/colors';

interface SalesPerson {
  readonly name: string;
  readonly sales: number;
  readonly displayValue: string;
  readonly percentage: number;
}

@Component({
  selector: 'app-top-sales-person',
  imports: [CommonModule, DashboardHeadingComponent, LucideAngularModule],
  templateUrl: './top-sales-person.component.html',
})
export class TopSalesPersonComponent {
  public readonly icons = { User };
  public readonly salesData = signal<readonly SalesPerson[]>(TOP_SALES_DATA);
  public readonly totalSales = signal(336000);
  public readonly totalDisplayValue = signal('GH₵ 43,901.00');

  public readonly personColors = ['#285711', '#8FEC61', '#C5CCCB', '#DDE4E5'];

  public getBarWidth(percentage: number): number {
    return percentage;
  }

  public getTotalSales(): string {
    return this.totalDisplayValue();
  }

  public getPersonColor(index: number): string {
    return this.personColors[index] || '#DDE4E5';
  }
}
