import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import * as L from 'leaflet';
import { filter } from 'rxjs/operators';

import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';

interface VehiculoActual {
  conductor: string;
  progreso: number;
  placa: string;
  estado: string;
}

interface Aviso {
  id: number;
  tipo: 'warning' | 'info' | 'success';
  titulo: string;
  tiempo: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './main.html',
  styleUrls: ['./main.scss']
})
export class MainComponent implements AfterViewInit {

  sidebarOpen = true;
  activeSection = 'inicio';

  currentRoute = '';

  private previewMap?: L.Map;

  menuItems = [
    { id: 'inicio', label: 'Inicio', icon: 'icon-home' },
    { id: 'vehiculos', label: 'Vehículos', icon: 'icon-car' },
    { id: 'rutas', label: 'Rutas', icon: 'icon-route' },
  ];

  vehiculoActual: VehiculoActual = {
    conductor: 'M. García',
    progreso: 72,
    placa: 'DEF-456',
    estado: 'En ruta'
  };

  avisos: Aviso[] = [
    { id: 1, tipo: 'warning', titulo: 'Retraso por lluvia en Zona Centro', tiempo: 'Hace 15 minutos' },
    { id: 2, tipo: 'success', titulo: 'Ruta Este completada exitosamente', tiempo: 'Hace 1 hora' }
  ];

  constructor(private router: Router) {
    this.currentRoute = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;

        if (this.currentRoute === '/main') {
          setTimeout(() => this.initPreviewMap(), 50);
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.currentRoute === '/main') {
        this.initPreviewMap();
      }
    }, 50);
  }

  // ============================
  // ⭐  FIX DEFINITIVO LEAFLET
  // ============================
  private initPreviewMap(): void {
    const container = document.getElementById('mainMapPreview') as any;
    if (!container) return;

    // 🧨 1. Si ya existe un map, eliminarlo completamente
    if (this.previewMap) {
      this.previewMap.off();   // quitar listeners
      this.previewMap.remove();  
      this.previewMap = undefined;
    }

    // 🧨 2. Leaflet guarda internamente el ID del contenedor → resetearlo
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    // 🟢 3. Crear mapa sin errores
    this.previewMap = L.map(container, {
      center: [3.8773, -77.0277],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.previewMap);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onSectionChange(section: string) {
    this.activeSection = section;

    if (section === 'mapa') {
      this.router.navigate(['/mapa']);
    } else if (section === 'vehiculos') {
      this.router.navigate(['/main', 'vehiculos']);
    } else if (section === 'inicio' || section === 'main') {
      this.router.navigate(['/main']);
    } else if (section === 'rutas') {
      this.router.navigate(['/mapa']);
    }
  }

  verRutaActiva() {
    this.router.navigate(['/mapa']);
  }

  abrirMapa() {
    this.router.navigate(['/mapa'], { queryParams: { create: '1' } });
  }

  verVehiculosActivos() {}

  marcarLeido(id: number) {
    this.avisos = this.avisos.filter(a => a.id !== id);
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
