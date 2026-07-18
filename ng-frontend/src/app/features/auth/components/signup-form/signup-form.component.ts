import { Component } from '@angular/core';
import { AuthWrapperComponent } from '../auth-wrapper/auth-wrapper.component';

@Component({
  selector: 'app-signup-form',
  imports: [AuthWrapperComponent],
  templateUrl: './signup-form.component.html',
})
export class SignupFormComponent {}
