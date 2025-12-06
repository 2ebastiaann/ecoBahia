import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/registrarse/registrarse';
import { MainComponent } from './pages/main/main';
import { VehiculosComponent } from './pages/vehiculos/vehiculos';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MapaComponent } from './pages/mapa/mapa';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Register },

  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'vehiculos', component: VehiculosComponent }
    ]
  },

  // Ruta directa al mapa (para dibujar/crear rutas)
  { path: 'mapa', component: MapaComponent },

  // Ruta comodín
  { path: '**', redirectTo: 'main' }
];
