import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LeafletMapService } from '../../services/map.service';

import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';
import { RouterModule } from '@angular/router';

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
  menuItems = [
    { id: 'inicio', label: 'Inicio', icon: 'icon-home' },
    { id: 'vehiculos', label: 'Vehículos', icon: 'icon-car' },
    { id: 'rutas', label: 'Rutas', icon: 'icon-route' },
    { id: 'mapa', label: 'Mapa', icon: 'icon-map' }
  ];

  vehiculoActual: VehiculoActual = {
    conductor: "M. García",
    progreso: 72,
    placa: "DEF-456",
    estado: "En ruta"
  };

  avisos: Aviso[] = [
    { id: 1, tipo: 'warning', titulo: 'Retraso por lluvia en Zona Centro', tiempo: 'Hace 15 minutos' },
    { id: 2, tipo: 'success', titulo: 'Ruta Este completada exitosamente', tiempo: 'Hace 1 hora' }
  ];

  constructor(private router: Router, private leaflet: LeafletMapService) {}

  ngAfterViewInit(): void {}

  // Inicializar el mapa pequeño en la interfaz principal
  ngAfterViewChecked(): void {
    // intenta inicializar el mapa preview si el contenedor existe
    try {
      this.leaflet.initMap('mainMapPreview');
    } catch (e) {
      // ignorar si no está montado aún
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onSectionChange(section: string) {
    this.activeSection = section;

    // Navegación simple según sección
    if (section === 'mapa') {
      // Ruta dedicada al mapa
      this.router.navigate(['/mapa']);
    } else if (section === 'vehiculos') {
      this.router.navigate(['/main', 'vehiculos']);
    } else if (section === 'inicio' || section === 'main') {
      this.router.navigate(['/main']);
    } else if (section === 'rutas') {
      // Abrir la vista de rutas/mapa donde se listan y manejan rutas
      this.router.navigate(['/mapa']);
    }
  }

  verRutaActiva() {
    this.router.navigate(['/mapa']);
  }

  abrirMapa() {
    // Abrir el mapa y solicitar creación para que el modal aparezca
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
