import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletMapService } from '../../services/map.service';
import { Router } from '@angular/router';

interface VehiculoActual {
  conductor: string;
  progreso: number;
  placa: string;
  estado: string;
}

interface ProximoCamion {
  ruta: string;
  zona: string;
  hora: string;
}

interface Eficiencia {
  porcentaje: number;
  kmHoy: number;
  kgRecolectados: number;
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
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrls: ['./main.scss']
})
export class MainComponent implements AfterViewInit, OnDestroy {
  sidebarOpen = true;
  activeSection = 'inicio';

  menuItems = [
    { id: 'inicio', label: 'Inicio', icon: 'icon-home' },
    { id: 'mapa', label: 'Mapa', icon: 'icon-map' },
    { id: 'rutas', label: 'Rutas', icon: 'icon-truck' },
    { id: 'avisos', label: 'Avisos', icon: 'icon-alert' },
    { id: 'vehiculos', label: 'Vehículos', icon: 'icon-vehicle' }
  ];

  vehiculoActual: VehiculoActual = {
    conductor: 'M. García',
    progreso: 72,
    placa: 'DEF-456',
    estado: 'En ruta'
  };

  proximoCamion: ProximoCamion = {
    ruta: 'Ruta Sur',
    zona: 'Zona Sur',
    hora: '11:45 AM'
  };

  eficiencia: Eficiencia = {
    porcentaje: 89,
    kmHoy: 58,
    kgRecolectados: 1240
  };

  avisos: Aviso[] = [
    { 
      id: 1, 
      tipo: 'warning', 
      titulo: 'Retraso por lluvia en Zona Centro', 
      tiempo: 'Hace 15 minutos' 
    },
    { 
      id: 2, 
      tipo: 'success', 
      titulo: 'Ruta Este completada exitosamente', 
      tiempo: 'Hace 1 hora' 
    }
  ];

  constructor(
    private mapService: LeafletMapService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    // Inicializar el mapa con un delay más largo para asegurar que el DOM está listo
    setTimeout(() => {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        // Limpiar cualquier contenido previo
        mapContainer.innerHTML = '';
        
        // Inicializar el mapa
        this.mapService.initMap('map');
        
        // Forzar actualización del tamaño
        setTimeout(() => {
          this.mapService.invalidateSize();
        }, 200);
      } else {
        console.error('Contenedor del mapa no encontrado');
      }
    }, 300);
  }

  ngOnDestroy(): void {
    // Limpiar recursos del mapa
    this.mapService.clearAll();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    
    // Invalidar el tamaño del mapa cuando cambia el sidebar
    setTimeout(() => {
      this.mapService.invalidateSize();
    }, 400);
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    
    // Centrar el mapa cuando se selecciona la sección de mapa
    if (section === 'mapa') {
      setTimeout(() => {
        this.mapService.centerMap();
        this.mapService.invalidateSize();
      }, 100);
    }
  }

  verRutaActiva(): void {
    // Centrar el mapa en la ruta activa del vehículo
    this.mapService.focusOnVehicle(this.vehiculoActual.placa);
    this.activeSection = 'mapa';
  }

  verTodasRutas(): void {
    this.mapService.showAllRoutes();
  }

  verVehiculosActivos(): void {
    this.mapService.showActiveVehicles();
  }

  marcarLeido(avisoId: number): void {
    this.avisos = this.avisos.filter(aviso => aviso.id !== avisoId);
    console.log(`Aviso ${avisoId} marcado como leído`);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}