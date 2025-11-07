import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, RouterLink, NotificationsComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {}
