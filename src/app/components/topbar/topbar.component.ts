import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bell } from 'lucide-angular';

@Component({
  selector: 'app-topbar',
  imports: [
    CommonModule,
    DatepickerComponent,
    FormsModule,
    LucideAngularModule,
  ],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  public readonly icons = { Bell };
  selectedDate: Date | null = new Date();

  onNotificationClick(): void {
    console.log('Notification clicked');
  }

  onDateChange(date: Date | null): void {
    this.selectedDate = date;
    console.log('Selected date:', date);
  }
}
