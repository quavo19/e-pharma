import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Info } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-heading',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard-heading.component.html',
})
export class DashboardHeadingComponent {
  public readonly icons = { Info };
  public title = input('Dashboard');
  public desc = input('Overview of your account and recent activities');
  public showTooltip = signal(false);

  onMouseEnter(): void {
    this.showTooltip.set(true);
  }

  onMouseLeave(): void {
    this.showTooltip.set(false);
  }
}
