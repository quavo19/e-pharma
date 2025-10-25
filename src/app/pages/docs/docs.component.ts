import { Component } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { FormControl } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-docs',
  imports: [InputComponent, ButtonComponent],
  templateUrl: './docs.component.html',
})
export class DocsComponent {
  emailControl = new FormControl('');
  title = 'pms';
  submit() {
    console.log(this.emailControl.value);
  }
}
