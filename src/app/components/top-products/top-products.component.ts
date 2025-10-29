import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeadingComponent } from '../dashboard-heading/dashboard-heading.component';

@Component({
  selector: 'app-top-products',
  imports: [CommonModule, DashboardHeadingComponent],
  templateUrl: './top-products.component.html',
})
export class TopProductsComponent {
  public readonly totalSales = '₵3,400,000';

  public readonly products = signal([
    {
      name: 'Paracetamol',
      percentage: 30,
      value: '1,200,000',
    },
    {
      name: 'Amoxicillin',
      percentage: 25,
      value: '950,000',
    },
    {
      name: 'Ibuprofen',
      percentage: 20,
      value: '750,000',
    },
    {
      name: 'Vitamin C',
      percentage: 15,
      value: '500,000',
    },
    {
      name: 'Aspirin',
      percentage: 10,
      value: '300,000',
    },
  ]);
}
