import { Component, signal, inject } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import {
  Eye,
  EyeClosed,
  LucideAngularModule,
  Phone,
  Lock,
} from 'lucide-angular';
import { CheckboxComponent } from '../custom-checkbox/custom-checkbox.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    LucideAngularModule,
    CheckboxComponent,
  ],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private router = inject(Router);
  
  protected readonly icons = { Eye, EyeClosed, Phone, Lock };
  protected readonly isPasswordVisible = signal(false);

  phoneControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  rememberMeControl = new FormControl(false);

  handlePasswordVisibility() {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  submit() {
    // Check if form is valid
    if (this.phoneControl.valid && this.passwordControl.valid) {
      console.log('Phone:', this.phoneControl.value);
      console.log('Password:', this.passwordControl.value);
      console.log('Remember me:', this.rememberMeControl.value);
      
      // Navigate to dashboard
      this.router.navigate(['/']);
    }
  }
}
