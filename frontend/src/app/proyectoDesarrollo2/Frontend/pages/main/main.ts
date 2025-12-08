import { Component, AfterViewInit, OnDestroy } from '@angular/core';
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
export class MainComponent implements AfterViewInit, OnDestroy {

  sidebarOpen = true;
  activeSection = 'inicio';

  currentRoute = '';

  private previewMap?: L.Map;
  private mapInitialized = false;
  private mapInitInProgress = false;
  private mapInitTimeout?: any;

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
          // Limpiar timeout anterior si existe
          if (this.mapInitTimeout) {
            clearTimeout(this.mapInitTimeout);
          }
          // Reiniciar mapa solo si se vuelve a /main desde otra ruta
          this.mapInitialized = false;
          this.mapInitTimeout = setTimeout(() => this.initPreviewMap(), 100);
        }
      });
  }

  ngAfterViewInit(): void {
    this.mapInitTimeout = setTimeout(() => {
      if (this.currentRoute === '/main') {
        this.initPreviewMap();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.mapInitTimeout) {
      clearTimeout(this.mapInitTimeout);
    }
    this.destroyMap();
  }

  // ============================
  // ⭐  FIX DEFINITIVO LEAFLET
  // ============================
  private destroyMap(): void {
    if (this.previewMap) {
      try {
        this.previewMap.off();
        this.previewMap.remove();
      } catch (e) {
        // Ignorar errores al destruir
      }
      this.previewMap = undefined;
    }
    this.mapInitialized = false;
    this.mapInitInProgress = false;
  }

  private initPreviewMap(): void {
    // Evitar múltiples inicializaciones simultáneas
    if (this.mapInitInProgress) {
      return;
    }

    // Si ya está inicializado, no reiniciar
    if (this.mapInitialized && this.previewMap) {
      return;
    }

    this.mapInitInProgress = true;

    try {
      const container = document.getElementById('mainMapPreview') as any;
      if (!container) {
        this.mapInitInProgress = false;
        return;
      }

      // 1. Destruir mapa anterior si existe
      if (this.previewMap) {
        try {
          this.previewMap.off();
          this.previewMap.remove();
        } catch (e) {
          // Ignorar errores
        }
        this.previewMap = undefined;
      }

      // 2. Limpiar referencias de Leaflet en el contenedor
      if (container._leaflet_id !== undefined) {
        container._leaflet_id = null;
      }

      // 3. Crear nuevo mapa
      this.previewMap = L.map(container, {
        center: [3.8773, -77.0277],
        zoom: 13
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.previewMap);

      this.mapInitialized = true;
    } catch (e) {
      // Ignorar errores en inicialización
      this.mapInitialized = false;
      this.previewMap = undefined;
    } finally {
      this.mapInitInProgress = false;
    }
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
