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

  // 🔹 para el *ngIf del mapa
  currentRoute = '';

  // instancia del mapa pequeño del dashboard
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
    // valor inicial
    this.currentRoute = this.router.url;

    // actualizar currentRoute en cada navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;

        // cuando volvemos a /main, recreamos el mapa preview
        if (this.currentRoute === '/main') {
          setTimeout(() => this.initPreviewMap(), 100);
        }
      });
  }

  ngAfterViewInit(): void {
    // primera vez que carga /main
    setTimeout(() => {
      if (this.currentRoute === '/main') {
        this.initPreviewMap();
      }
    }, 100);
  }

  // 🔥 crea / recrea el mapa preview dentro de #mainMapPreview
  private initPreviewMap(): void {
    const container = document.getElementById('mainMapPreview');
    if (!container) return;

    // si ya había un mapa, destruirlo
    if (this.previewMap) {
      this.previewMap.remove();
      this.previewMap = undefined;
    }

    this.previewMap = L.map(container, {
      center: [3.8773, -77.0277], // Buenaventura
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
