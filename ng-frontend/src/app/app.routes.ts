import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { LoginPageComponent } from './features/auth/pages/login/login-page.component';
import { SignupPageComponent } from './features/auth/pages/signup/signup-page.component';

export const routes: Routes = [
  { title: 'Vendee | Home', path: '', component: HomePageComponent },
  { title: 'Vendee | Login', path: 'login', component: LoginPageComponent },
  { title: 'Vendee | Sign up', path: 'signup', component: SignupPageComponent },
];
