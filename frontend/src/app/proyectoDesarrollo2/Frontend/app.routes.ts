import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/registrarse/registrarse';
import { MainComponent } from './pages/main/main';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'registro', component: Register },
  { path: 'main', component: MainComponent },

  // Ruta comodín si intentan entrar a algo que no existe
  { path: '**', redirectTo: 'login' }
];