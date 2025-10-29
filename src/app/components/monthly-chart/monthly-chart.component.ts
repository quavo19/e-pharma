import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeadingComponent } from '../dashboard-heading/dashboard-heading.component';

interface MonthlyData {
  month: string;
  value: number;
  displayValue: string;
}

@Component({
  selector: 'app-monthly-chart',
  imports: [CommonModule, DashboardHeadingComponent],
  templateUrl: './monthly-chart.component.html',
})
export class MonthlyChartComponent {
  public readonly maxValue = 1400;
  public readonly hoveredMonth = signal<string | null>(null);

  public readonly monthlyData = signal<MonthlyData[]>([
    { month: 'Jan', value: 880, displayValue: '₵625,560.21' },
    { month: 'Feb', value: 750, displayValue: '₵532,890.15' },
    { month: 'Mar', value: 1120, displayValue: '₵795,430.67' },
    { month: 'Apr', value: 350, displayValue: '₵248,750.33' },
    { month: 'May', value: 750, displayValue: '₵625,560.21' },
    { month: 'Jun', value: 1120, displayValue: '₵795,430.67' },
    { month: 'Jul', value: 750, displayValue: '₵532,890.15' },
    { month: 'Aug', value: 1220, displayValue: '₵866,120.89' },
    { month: 'Sep', value: 520, displayValue: '₵369,240.45' },
    { month: 'Oct', value: 920, displayValue: '₵653,180.72' },
    { month: 'Nov', value: 1180, displayValue: '₵837,960.34' },
    { month: 'Dec', value: 280, displayValue: '₵198,890.12' },
  ]);

  public getBarHeight(value: number): number {
    const height = (value / this.maxValue) * 100;
    return Math.max(height, 2);
  }

  public getRemainingHeight(value: number): number {
    return ((this.maxValue - value) / this.maxValue) * 100;
  }

  public onMouseEnter(month: string): void {
    this.hoveredMonth.set(month);
  }

  public onMouseLeave(): void {
    this.hoveredMonth.set(null);
  }

  public isHovered(month: string): boolean {
    return this.hoveredMonth() === month;
  }

  public getHoveredData(): MonthlyData | null {
    const month = this.hoveredMonth();
    if (!month) return null;
    return this.monthlyData().find((data) => data.month === month) || null;
  }

  public getYAxisLabels(): number[] {
    const labels: number[] = [];
    const step = this.maxValue / 7;

    for (let i = 0; i <= 7; i++) {
      labels.push(Math.round(step * i));
    }

    return labels.reverse();
  }

  public isOddBar(index: number): boolean {
    return index % 2 === 1;
  }
}
