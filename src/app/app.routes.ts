import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { PropertiesComponent } from './components/properties/properties.component';
import { PropertiesDetailsComponent } from './components/properties-details/properties-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'properties', component: PropertiesComponent },
  {
    path: 'propertiesDetails/:id',
    component: PropertiesDetailsComponent,
    canActivate: [authGuard],
  },
];
