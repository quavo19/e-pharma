import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, NotificationsComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {}
