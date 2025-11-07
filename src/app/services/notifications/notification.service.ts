import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  description: string;
  image?: string;
  timestamp: Date;
  read: boolean;
  type: 'expired' | 'expiring' | 'low_stock' | 'order' | 'system';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([
    {
      id: '1',
      title: '20 drugs expired today',
      description:
        'The following medications have reached their expiration date and need to be removed from inventory: Paracetamol 500mg, Amoxicillin 250mg, and 18 others.',
      image: '/images/no-data.png',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      read: false,
      type: 'expired',
    },
    {
      id: '2',
      title: '30 items nearing expiry next month',
      description:
        'These products will expire within the next 30 days. Please review and take appropriate action to prevent losses.',
      image: '/images/no-data.png',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: false,
      type: 'expiring',
    },
    {
      id: '3',
      title: 'Low stock alert: Aspirin',
      description:
        'Aspirin 100mg tablets are running low. Current stock: 15 units. Consider placing a new order soon.',
      image: '/images/no-data.png',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      read: true,
      type: 'low_stock',
    },
    {
      id: '4',
      title: 'New order received',
      description:
        'Order #12345 from Supplier ABC has been received and is ready for processing.',
      image: '/images/no-data.png',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      read: true,
      type: 'order',
    },
    {
      id: '5',
      title: 'System maintenance scheduled',
      description:
        'Scheduled maintenance will occur on Saturday, December 15th from 2:00 AM to 4:00 AM.',
      image: '/images/no-data.png',
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      read: true,
      type: 'system',
    },
  ]);

  getNotifications() {
    return this.notifications.asReadonly();
  }

  getUnreadCount() {
    return this.notifications().filter((n) => !n.read).length;
  }

  markAsRead(id: string): void {
    this.notifications.update((notifications) =>
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllAsRead(): void {
    this.notifications.update((notifications) =>
      notifications.map((n) => ({ ...n, read: true }))
    );
  }

  deleteNotification(id: string): void {
    this.notifications.update((notifications) =>
      notifications.filter((n) => n.id !== id)
    );
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    this.notifications.update((notifications) => [
      newNotification,
      ...notifications,
    ]);
  }
}

