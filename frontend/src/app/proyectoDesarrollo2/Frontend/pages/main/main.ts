import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletMapService } from '../../services/map'; // ← CORREGIDO
import { Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HeaderComponent } from '../../components/header/header';
import { CreateRouteComponent, RouteData } from '../../components/route/route';

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
  imports: [CommonModule, SidebarComponent, HeaderComponent, CreateRouteComponent],
  templateUrl: './main.html',
  styleUrls: ['./main.scss']
})
export class MainComponent implements AfterViewInit, OnDestroy {
  sidebarOpen = true;
  activeSection = 'inicio';
  showCreateRouteModal = false;
  savedRoutes: RouteData[] = [];

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
    setTimeout(() => {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.style.height = '100%';
        mapContainer.style.width = '100%';
        mapContainer.innerHTML = '';
        this.mapService.initMap('map');

        // Cargar rutas guardadas desde localStorage
        this.loadSavedRoutes();

        setTimeout(() => {
          this.mapService.invalidateSize();
        }, 300);

        setTimeout(() => {
          this.mapService.invalidateSize();
        }, 900);
      } else {
        console.error('Contenedor del mapa no encontrado');
      }
    }, 700);
  }

  ngOnDestroy(): void {
    this.mapService.clearAll();
  }

  // Public wrapper so templates can trigger focusing on a route
  focusOnRoute(routeId: string): void {
    this.mapService.focusOnRoute(routeId);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    
    setTimeout(() => {
      this.mapService.invalidateSize();
    }, 400);
  }

  onSectionChange(section: string): void {
    this.activeSection = section;
    
    if (section === 'mapa') {
      setTimeout(() => {
        this.mapService.centerMap();
        this.mapService.invalidateSize();
      }, 100);
    }

    // Si cambia a la sección de rutas, mostrar todas las rutas
    if (section === 'rutas') {
      setTimeout(() => {
        this.mapService.showAllRoutes();
      }, 100);
    }
  }

  onLogout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  verRutaActiva(): void {
    this.activeSection = 'mapa';
    this.mapService.centerMap();
  }

  verTodasRutas(): void {
    this.mapService.showAllRoutes();
  }

  verVehiculosActivos(): void {
    console.log('Mostrando vehículos activos');
  }

  marcarLeido(avisoId: number): void {
    this.avisos = this.avisos.filter(aviso => aviso.id !== avisoId);
    console.log(`Aviso ${avisoId} marcado como leído`);
  }

  // Métodos para gestión de rutas
  openCreateRouteModal(): void {
    this.showCreateRouteModal = true;
  }

  closeCreateRouteModal(): void {
    this.showCreateRouteModal = false;
  }

  onRouteCreated(route: RouteData): void {
    console.log('Ruta creada:', route);
    
    // Agregar la ruta al array local
    this.savedRoutes.push(route);
    
    // Guardar en localStorage
    this.saveRoutesToStorage();
    
    // Dibujar la ruta en el mapa
    this.drawRouteOnMap(route);
    
    // Mostrar notificación
    this.addNotification('success', `Ruta "${route.nombre}" creada exitosamente`);
    
    // Aquí puedes enviar la ruta al backend
    this.sendRouteToBackend(route);
  }

  drawRouteOnMap(route: RouteData): void {
    if (!route.puntoInicio || !route.puntoFin) return;

    // Dibujar la polilínea
    this.mapService.drawRoute(route.coordenadasRuta, {
      id: route.id!,
      nombre: route.nombre,
      color: route.color,
      data: route
    });

    // Agregar marcadores
    this.mapService.addRouteMarkers(
      route.puntoInicio,
      route.puntoFin,
      route.puntosIntermedios
    );

    // Enfocar en la nueva ruta
    setTimeout(() => {
      this.mapService.focusOnRoute(route.id!);
    }, 300);
  }

  saveRoutesToStorage(): void {
    try {
      localStorage.setItem('ecobahia_routes', JSON.stringify(this.savedRoutes));
    } catch (error) {
      console.error('Error al guardar rutas:', error);
    }
  }

  loadSavedRoutes(): void {
    try {
      const routesJson = localStorage.getItem('ecobahia_routes');
      if (routesJson) {
        this.savedRoutes = JSON.parse(routesJson);
        
        // Redibujar las rutas en el mapa
        this.savedRoutes.forEach(route => {
          this.drawRouteOnMap(route);
        });
      }
    } catch (error) {
      console.error('Error al cargar rutas:', error);
    }
  }

  deleteRoute(routeId: string): void {
    // Eliminar del mapa
    this.mapService.removeRoute(routeId);
    
    // Eliminar del array
    this.savedRoutes = this.savedRoutes.filter(r => r.id !== routeId);
    
    // Actualizar localStorage
    this.saveRoutesToStorage();
    
    // Notificar al backend
    this.deleteRouteFromBackend(routeId);
    
    // Mostrar notificación
    this.addNotification('info', 'Ruta eliminada');
  }

  addNotification(tipo: 'warning' | 'info' | 'success', titulo: string): void {
    const newAviso: Aviso = {
      id: Date.now(),
      tipo,
      titulo,
      tiempo: 'Justo ahora'
    };
    
    this.avisos.unshift(newAviso);
  }

  // Métodos para comunicación con el backend
  async sendRouteToBackend(route: RouteData): Promise<void> {
    try {
      // Estructura de datos lista para enviar al backend
      const routePayload = {
        id: route.id,
        nombre: route.nombre,
        descripcion: route.descripcion,
        zona_asignada: route.zonaAsignada,
        color: route.color,
        estado: route.estado,
        punto_inicio: {
          latitud: route.puntoInicio?.lat,
          longitud: route.puntoInicio?.lng,
          nombre: route.puntoInicio?.name
        },
        punto_fin: {
          latitud: route.puntoFin?.lat,
          longitud: route.puntoFin?.lng,
          nombre: route.puntoFin?.name
        },
        puntos_intermedios: route.puntosIntermedios.map(p => ({
          latitud: p.lat,
          longitud: p.lng,
          nombre: p.name
        })),
        coordenadas_ruta: route.coordenadasRuta,
        distancia_estimada: route.distanciaEstimada,
        tiempo_estimado: route.tiempoEstimado,
        fecha_creacion: route.fechaCreacion
      };

      console.log('Enviando ruta al backend:', routePayload);

      // Descomenta cuando tengas el endpoint del backend
      /*
      const response = await fetch('http://tu-api.com/api/rutas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(routePayload)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la ruta en el servidor');
      }

      const data = await response.json();
      console.log('Ruta guardada en el servidor:', data);
      */
    } catch (error) {
      console.error('Error al enviar ruta al backend:', error);
      this.addNotification('warning', 'Error al guardar la ruta en el servidor');
    }
  }

  async deleteRouteFromBackend(routeId: string): Promise<void> {
    try {
      console.log('Eliminando ruta del backend:', routeId);

      // Descomenta cuando tengas el endpoint del backend
      /*
      const response = await fetch(`http://tu-api.com/api/rutas/${routeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la ruta del servidor');
      }
      */
    } catch (error) {
      console.error('Error al eliminar ruta del backend:', error);
    }
  }
}