import { Component, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCheck, Bell } from 'lucide-angular';
import { NotificationService, Notification } from '../../services/notifications/notification.service';
import { formatRelativeTime } from '../../utils/time-format.util';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  public readonly icons = { CheckCheck, Bell };
  notifications = signal<Notification[]>([]);
  isOpen = signal(false);

  constructor(private notificationService: NotificationService) {
    // Subscribe to notifications
    effect(() => {
      this.notifications.set(this.notificationService.getNotifications()());
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications-container')) {
      this.closeDropdown();
    }
  }

  getNotifications(): Notification[] {
    return this.notifications();
  }

  getUnreadCount(): number {
    return this.notificationService.getUnreadCount();
  }

  formatTime(date: Date): string {
    return formatRelativeTime(date);
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }
}

