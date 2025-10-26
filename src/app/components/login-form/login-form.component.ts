import { Component, signal } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import {
  Eye,
  EyeClosed,
  LucideAngularModule,
  Mail,
  Lock,
} from 'lucide-angular';
import { CheckboxComponent } from '../custom-checkbox/custom-checkbox.component';

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
  protected readonly icons = { Eye, EyeClosed, Mail, Lock };
  protected readonly isPasswordVisible = signal(false);

  emailControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  rememberMeControl = new FormControl(false);

  handlePasswordVisibility() {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  submit() {
    console.log('Email:', this.emailControl.value);
    console.log('Password:', this.passwordControl.value);
    console.log('Remember me:', this.rememberMeControl.value);
  }
}
