import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ShoppingCart,
  Users,
  Clock,
  AlertTriangle,
  XCircle,
  Hourglass,
  Ban,
} from 'lucide-angular';
import { DashboardHeadingComponent } from '../dashboard-heading/dashboard-heading.component';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-dashboard-cards',
  imports: [
    CommonModule,
    LucideAngularModule,
    DashboardHeadingComponent,
    DashboardCardComponent,
    PopupComponent,
  ],
  templateUrl: './dashboard-cards.component.html',
})
export class DashboardCardsComponent {
  public readonly icons = {
    ShoppingCart,
    Users,
    Clock,
    AlertTriangle,
    XCircle,
    Hourglass,
    Ban,
  };

  isModalOpen = signal(false);
  selectedCardTitle = signal('');
  selectedCardData = signal<any[]>([]);

  private readonly cardTableData = {
    'Total Sales (GH₵)': [
      { drug: 'Amoxicillin 500mg', unitsSold: 120, revenue: '₵6,000' },
      { drug: 'Paracetamol 500mg', unitsSold: 240, revenue: '₵4,800' },
      { drug: 'Azithromycin 250mg', unitsSold: 90, revenue: '₵3,150' },
    ],
    'Total Customers': [
      {
        drug: 'Vitamin C 1000mg',
        customerCount: 85,
        unitsDispensed: 180,
        revenue: '₵2,700',
      },
      {
        drug: 'Ibuprofen 400mg',
        customerCount: 62,
        unitsDispensed: 140,
        revenue: '₵2,100',
      },
      {
        drug: 'Cough Syrup 100ml',
        customerCount: 48,
        unitsDispensed: 95,
        revenue: '₵1,425',
      },
    ],
    'Nearing Expiry': [
      {
        drug: 'Metformin 500mg',
        expiry: '2025-11-15',
        batch: 'MFN-2309',
        quantity: 40,
        value: '₵800',
      },
      {
        drug: 'Lisinopril 10mg',
        expiry: '2025-12-01',
        batch: 'LSN-2310',
        quantity: 25,
        value: '₵625',
      },
      {
        drug: 'Atorvastatin 20mg',
        expiry: '2025-12-10',
        batch: 'ATV-2311',
        quantity: 30,
        value: '₵900',
      },
    ],
    'Low Stock': [
      { drug: 'Insulin 10ml', current: 5, min: 15, value: '₵1,500' },
      { drug: 'Omeprazole 20mg', current: 7, min: 20, value: '₵560' },
      { drug: 'Amoxiclav 625mg', current: 3, min: 10, value: '₵450' },
    ],
    'Out of Stock': [
      {
        drug: 'Salbutamol Inhaler',
        lastRestock: '2025-10-10',
        value: '₵1,200',
      },
      {
        drug: 'Hydroxychloroquine 200mg',
        lastRestock: '2025-10-06',
        value: '₵900',
      },
      { drug: 'Warfarin 5mg', lastRestock: '2025-10-03', value: '₵700' },
    ],
    'Expired Products': [
      {
        drug: 'Cefuroxime 500mg',
        expiry: '2025-09-05',
        quantity: 18,
        value: '₵1,440',
      },
      {
        drug: 'Diazepam 5mg',
        expiry: '2025-09-12',
        quantity: 10,
        value: '₵500',
      },
      {
        drug: 'Multivitamin Syrup 100ml',
        expiry: '2025-09-20',
        quantity: 22,
        value: '₵660',
      },
    ],
  };

  onSeeMore(cardTitle: string): void {
    this.selectedCardTitle.set(cardTitle);
    this.selectedCardData.set(
      this.cardTableData[cardTitle as keyof typeof this.cardTableData] || []
    );
    this.isModalOpen.set(true);
  }

  onCloseModal(): void {
    this.isModalOpen.set(false);
  }

  getTableHeaders(): string[] {
    const data = this.selectedCardData();
    if (data.length === 0) return [];

    return Object.keys(data[0]);
  }

  getTableRowValues(row: any): any[] {
    return Object.values(row);
  }
}
