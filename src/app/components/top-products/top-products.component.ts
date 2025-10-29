import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeadingComponent } from '../dashboard-heading/dashboard-heading.component';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-top-products',
  imports: [CommonModule, DashboardHeadingComponent, PopupComponent],
  templateUrl: './top-products.component.html',
})
export class TopProductsComponent {
  public readonly totalSales = '₵3,400,000';

  // Modal state
  isModalOpen = signal(false);

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

  // Extended products list for modal view
  public readonly allProducts = signal([
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
    {
      name: 'Metformin',
      percentage: 8,
      value: '240,000',
    },
    {
      name: 'Lisinopril',
      percentage: 7,
      value: '210,000',
    },
    {
      name: 'Atorvastatin',
      percentage: 6,
      value: '180,000',
    },
    {
      name: 'Omeprazole',
      percentage: 5,
      value: '150,000',
    },
    {
      name: 'Amlodipine',
      percentage: 4,
      value: '120,000',
    },
    {
      name: 'Simvastatin',
      percentage: 3,
      value: '90,000',
    },
    {
      name: 'Losartan',
      percentage: 2,
      value: '60,000',
    },
    {
      name: 'Hydrochlorothiazide',
      percentage: 1.5,
      value: '45,000',
    },
    {
      name: 'Metoprolol',
      percentage: 1,
      value: '30,000',
    },
    {
      name: 'Furosemide',
      percentage: 0.8,
      value: '24,000',
    },
  ]);

  onSeeMore(): void {
    this.isModalOpen.set(true);
  }

  onCloseModal(): void {
    this.isModalOpen.set(false);
  }
}
