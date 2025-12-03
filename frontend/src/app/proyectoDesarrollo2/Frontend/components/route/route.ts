import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeafletMapService } from '../../services/map'; // ← CORREGIDO: apunta a map.ts
import * as L from 'leaflet';

export interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

export interface RouteData {
  id?: string;
  nombre: string;
  descripcion: string;
  puntoInicio: RoutePoint | null;
  puntoFin: RoutePoint | null;
  puntosIntermedios: RoutePoint[];
  distanciaEstimada?: number;
  tiempoEstimado?: number;
  coordenadasRuta: [number, number][];
  zonaAsignada: string;
  color: string;
  fechaCreacion?: Date;
  estado: 'activa' | 'inactiva' | 'en_revision';
}

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgForOf],
  templateUrl: './route.html',
  styleUrls: ['./route.scss']
})
export class CreateRouteComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() routeCreated = new EventEmitter<RouteData>();

  routeData: RouteData = {
    nombre: '',
    descripcion: '',
    puntoInicio: null,
    puntoFin: null,
    puntosIntermedios: [],
    coordenadasRuta: [],
    zonaAsignada: '',
    color: '#10b981',
    estado: 'activa'
  };

  selectingPoint: 'inicio' | 'fin' | 'intermedio' | null = null;
  mapClickListener: any;
  temporaryMarkers: L.Marker[] = [];
  previewRoute: L.Polyline | null = null;

  colors = [
    { value: '#10b981', label: 'Verde' },
    { value: '#3b82f6', label: 'Azul' },
    { value: '#f59e0b', label: 'Naranja' },
    { value: '#ef4444', label: 'Rojo' },
    { value: '#8b5cf6', label: 'Púrpura' },
    { value: '#06b6d4', label: 'Cian' }
  ];

  predefinedLocations = [
    { name: 'Terminal de Transporte', lat: 3.8801, lng: -77.0318 },
    { name: 'Plaza Principal', lat: 3.8881, lng: -77.0288 },
    { name: 'Puerto Marítimo', lat: 3.8951, lng: -77.0218 },
    { name: 'Zona Industrial', lat: 3.8651, lng: -77.0418 },
    { name: 'Centro Comercial', lat: 3.8751, lng: -77.0368 }
  ];

  constructor(private mapService: LeafletMapService) {}

  ngOnInit(): void {
    this.setupMapClickListener();
  }

  ngOnDestroy(): void {
    this.cleanupMapElements();
  }

  setupMapClickListener(): void {
    const map = this.mapService.getMap();
    if (!map) return;

    this.mapClickListener = (e: L.LeafletMouseEvent) => {
      if (this.selectingPoint) {
        this.handleMapClick(e.latlng);
      }
    };

    map.on('click', this.mapClickListener);
  }

  handleMapClick(latlng: L.LatLng): void {
    const point: RoutePoint = {
      lat: latlng.lat,
      lng: latlng.lng,
      name: `Punto ${this.selectingPoint === 'inicio' ? 'Inicio' : this.selectingPoint === 'fin' ? 'Fin' : 'Intermedio'}`
    };

    if (this.selectingPoint === 'inicio') {
      // Limpiar marcador anterior si existe
      if (this.routeData.puntoInicio) {
        this.removeMarkerByPoint(this.routeData.puntoInicio);
      }
      this.routeData.puntoInicio = point;
      this.addMarkerToMap(point, 'inicio');
    } else if (this.selectingPoint === 'fin') {
      if (this.routeData.puntoFin) {
        this.removeMarkerByPoint(this.routeData.puntoFin);
      }
      this.routeData.puntoFin = point;
      this.addMarkerToMap(point, 'fin');
    } else if (this.selectingPoint === 'intermedio') {
      this.routeData.puntosIntermedios.push(point);
      this.addMarkerToMap(point, 'intermedio');
    }

    this.selectingPoint = null;
    this.updateRoutePreview();
  }

  addMarkerToMap(point: RoutePoint, type: 'inicio' | 'fin' | 'intermedio'): void {
    const map = this.mapService.getMap();
    if (!map) return;

    const iconColors = {
      inicio: '#10b981',
      fin: '#ef4444',
      intermedio: '#3b82f6'
    };

    const iconLabels = {
      inicio: '🟢',
      fin: '🔴',
      intermedio: '🔵'
    };

    const icon = L.divIcon({
      className: 'custom-route-point',
      html: `<div style="background: ${iconColors[type]}; color: white; padding: 8px; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 18px;">${iconLabels[type]}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker([point.lat, point.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${point.name}</strong>`);

    this.temporaryMarkers.push(marker);
  }

  updateRoutePreview(): void {
    const map = this.mapService.getMap();
    if (!map) return;

    // Limpiar ruta previa
    if (this.previewRoute) {
      map.removeLayer(this.previewRoute);
    }

    // Crear nueva ruta si hay inicio y fin
    if (this.routeData.puntoInicio && this.routeData.puntoFin) {
      const coordinates: L.LatLngExpression[] = [
        [this.routeData.puntoInicio.lat, this.routeData.puntoInicio.lng],
        ...this.routeData.puntosIntermedios.map(p => [p.lat, p.lng] as L.LatLngExpression),
        [this.routeData.puntoFin.lat, this.routeData.puntoFin.lng]
      ];

      this.previewRoute = L.polyline(coordinates, {
        color: this.routeData.color,
        weight: 5,
        opacity: 0.7,
        dashArray: '10, 8'
      }).addTo(map);

      // Calcular distancia estimada
      this.calculateDistance(coordinates);

      // Ajustar vista al recorrido
      map.fitBounds(this.previewRoute.getBounds(), { padding: [50, 50] });
    }
  }

  calculateDistance(coordinates: L.LatLngExpression[]): void {
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const point1 = L.latLng(coordinates[i]);
      const point2 = L.latLng(coordinates[i + 1]);
      totalDistance += point1.distanceTo(point2);
    }
    this.routeData.distanciaEstimada = Math.round(totalDistance / 1000 * 100) / 100; // km
    this.routeData.tiempoEstimado = Math.round(totalDistance / 1000 / 30 * 60); // minutos (asumiendo 30 km/h)
  }

  startSelectingPoint(type: 'inicio' | 'fin' | 'intermedio'): void {
    this.selectingPoint = type;
  }

  usePredefinedLocation(type: 'inicio' | 'fin', location: any): void {
    if (!location) return; // Protección contra undefined
    
    const point: RoutePoint = {
      lat: location.lat,
      lng: location.lng,
      name: location.name
    };

    if (type === 'inicio') {
      if (this.routeData.puntoInicio) {
        this.removeMarkerByPoint(this.routeData.puntoInicio);
      }
      this.routeData.puntoInicio = point;
      this.addMarkerToMap(point, 'inicio');
    } else if (type === 'fin') {
      if (this.routeData.puntoFin) {
        this.removeMarkerByPoint(this.routeData.puntoFin);
      }
      this.routeData.puntoFin = point;
      this.addMarkerToMap(point, 'fin');
    }

    this.updateRoutePreview();
  }

  removeMarkerByPoint(point: RoutePoint): void {
    const map = this.mapService.getMap();
    if (!map) return;

    const markerIndex = this.temporaryMarkers.findIndex(marker => {
      const latlng = marker.getLatLng();
      return latlng.lat === point.lat && latlng.lng === point.lng;
    });

    if (markerIndex !== -1) {
      map.removeLayer(this.temporaryMarkers[markerIndex]);
      this.temporaryMarkers.splice(markerIndex, 1);
    }
  }

  removeIntermediatePoint(index: number): void {
    const point = this.routeData.puntosIntermedios[index];
    this.removeMarkerByPoint(point);
    this.routeData.puntosIntermedios.splice(index, 1);
    this.updateRoutePreview();
  }

  cleanupMapElements(): void {
    const map = this.mapService.getMap();
    if (!map) return;

    // Remover todos los marcadores temporales
    this.temporaryMarkers.forEach(marker => map.removeLayer(marker));
    this.temporaryMarkers = [];

    // Remover ruta de vista previa
    if (this.previewRoute) {
      map.removeLayer(this.previewRoute);
      this.previewRoute = null;
    }

    // Remover listener
    if (this.mapClickListener) {
      map.off('click', this.mapClickListener);
    }
  }

  saveRoute(): void {
    if (!this.isValidRoute()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Construir coordenadas finales
    const coordinates: [number, number][] = [
      [this.routeData.puntoInicio!.lat, this.routeData.puntoInicio!.lng],
      ...this.routeData.puntosIntermedios.map(p => [p.lat, p.lng] as [number, number]),
      [this.routeData.puntoFin!.lat, this.routeData.puntoFin!.lng]
    ];

    const finalRoute: RouteData = {
      ...this.routeData,
      coordenadasRuta: coordinates,
      fechaCreacion: new Date(),
      id: this.generateRouteId()
    };

    this.routeCreated.emit(finalRoute);
    this.closeModal();
  }

  isValidRoute(): boolean {
    return !!(
      this.routeData.nombre &&
      this.routeData.zonaAsignada &&
      this.routeData.puntoInicio &&
      this.routeData.puntoFin
    );
  }

  generateRouteId(): string {
    return `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  closeModal(): void {
    this.cleanupMapElements();
    this.resetForm();
    this.close.emit();
  }

  resetForm(): void {
    this.routeData = {
      nombre: '',
      descripcion: '',
      puntoInicio: null,
      puntoFin: null,
      puntosIntermedios: [],
      coordenadasRuta: [],
      zonaAsignada: '',
      color: '#10b981',
      estado: 'activa'
    };
    this.selectingPoint = null;
  }
}