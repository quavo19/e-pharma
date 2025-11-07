import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideAngularModule, Save, Bell, User, Lock, Pencil, X, Mail, Smartphone, Package, AlertTriangle, ShoppingCart } from 'lucide-angular';
import { InputComponent } from '../../components/input/input.component';
import { SlideToggleComponent } from '../../components/slide-toggle/slide-toggle.component';
import { TabsComponent, TabItem } from '../../components/tabs/tabs.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputComponent,
    SlideToggleComponent,
    TabsComponent,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private fb = inject(FormBuilder);

  public readonly icons = { Save, Bell, User, Lock, Pencil, X, Mail, Smartphone, Package, AlertTriangle, ShoppingCart };

  // Profile edit mode
  public isProfileEditMode = signal<boolean>(false);
  
  // Store original values for cancel
  private originalProfileValues = {
    name: 'Admin User',
    email: 'admin@pharmacy.com',
    phone: '+233 24 123 4567',
  };

  // Tabs configuration
  public readonly tabs: TabItem[] = [
    { label: 'Profile', id: 'profile' },
    { label: 'Security', id: 'security' },
    { label: 'Notifications', id: 'notifications' },
  ];

  public activeTab = signal<string>('profile');

  // Profile form
  profileForm = this.fb.group({
    name: new FormControl('Admin User', [Validators.required]),
    email: new FormControl('admin@pharmacy.com', [Validators.required, Validators.email]),
    phone: new FormControl('+233 24 123 4567', [Validators.required]),
  });

  // Password form
  passwordForm = this.fb.group({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  // Notification preferences
  notificationPreferences = signal<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    lowStockAlerts: boolean;
    expiryAlerts: boolean;
    orderUpdates: boolean;
  }>({
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    expiryAlerts: true,
    orderUpdates: true,
  });

  enableProfileEdit(): void {
    this.isProfileEditMode.set(true);
    // Store original values
    this.originalProfileValues = {
      name: this.profileForm.controls.name.value || '',
      email: this.profileForm.controls.email.value || '',
      phone: this.profileForm.controls.phone.value || '',
    };
  }

  cancelProfileEdit(): void {
    // Restore original values
    this.profileForm.patchValue(this.originalProfileValues);
    this.isProfileEditMode.set(false);
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      console.log('Saving profile:', this.profileForm.value);
      // TODO: Save to API
      // After successful save, disable edit mode
      this.isProfileEditMode.set(false);
      // Update original values
      this.originalProfileValues = {
        name: this.profileForm.controls.name.value || '',
        email: this.profileForm.controls.email.value || '',
        phone: this.profileForm.controls.phone.value || '',
      };
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
      }
      console.log('Changing password');
      // TODO: Save to API
      this.passwordForm.reset();
    }
  }

  toggleNotification(key: 'emailNotifications' | 'pushNotifications' | 'lowStockAlerts' | 'expiryAlerts' | 'orderUpdates', value: boolean): void {
    this.notificationPreferences.update((prefs) => ({
      ...prefs,
      [key]: value,
    }));
    // TODO: Save to API
  }

  onTabChange(tabId: string): void {
    this.activeTab.set(tabId);
  }
}

