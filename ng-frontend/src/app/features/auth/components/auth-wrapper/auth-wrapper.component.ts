import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardAvatar,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
    MatButton,
    MatCardAvatar,
  ],
  templateUrl: './auth-wrapper.component.html',
})
export class AuthWrapperComponent {
  heading = input.required<string>();
  backButtonLabel = input<string>();
  backButtonHref = input<string>();
}
