import { Component } from '@angular/core';
import { DashboardCardsComponent } from '../../components/dashboard-cards/dashboard-cards.component';
import { TopProductsComponent } from '../../components/top-products/top-products.component';
import { MonthlyChartComponent } from '../../components/monthly-chart/monthly-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardCardsComponent,
    TopProductsComponent,
    MonthlyChartComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
