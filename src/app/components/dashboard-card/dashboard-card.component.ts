import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-card',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard-card.component.html',
})
export class DashboardCardComponent {
  title = input.required<string>();
  count = input.required<string>();
  value = input.required<string>();
  icon = input.required<any>();
  tableData = input<any[]>([]);

  onSeeMore = output<void>();
}
