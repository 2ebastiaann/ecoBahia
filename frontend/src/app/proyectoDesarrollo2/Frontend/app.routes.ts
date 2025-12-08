import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/registrarse/registrarse';
import { MainComponent } from './pages/main/main';
import { VehiculosComponent } from './pages/vehiculos/vehiculos';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MapaComponent } from './pages/mapa/mapa';

// 🔥 IMPORTAR GUARD
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Ruta raíz → siempre al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rutas públicas (solo login y registro)
  { path: 'login', component: Login },
  { path: 'registro', component: Register },

  // 🔥 Rutas protegidas con AuthGuard
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'vehiculos', component: VehiculosComponent, canActivate: [AuthGuard] }
    ]
  },

  // 🔥 Mapa protegido
  { path: 'mapa', component: MapaComponent, canActivate: [AuthGuard] },

  // Ruta comodín → redirige a login
  { path: '**', redirectTo: 'login' }
];
