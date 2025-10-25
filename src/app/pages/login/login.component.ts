import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { Shield, WifiOff, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, LucideAngularModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected readonly icons = { Shield, WifiOff };
}
