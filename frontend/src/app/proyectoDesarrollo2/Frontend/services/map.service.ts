import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class LeafletMapService {

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private routes: L.Polyline[] = [];
  
  // Coordenadas de Buenaventura (puedes cambiarlas)
  private defaultCenter: L.LatLngExpression = [3.8801, -77.0318];
  private defaultZoom = 13;

  constructor() {
    // Fix icon paths for Angular
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png'
    });
  }

  initMap(divId: string): void {
    // Limpiar mapa anterior si existe
    if (this.map) {
      this.map.remove();
    }

    // Crear el mapa centrado en Buenaventura
    this.map = L.map(divId).setView(this.defaultCenter, this.defaultZoom);

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Agregar marcadores y rutas de demostración
    this.addDemoData();

    // Forzar actualización del tamaño del mapa
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  getMap(): L.Map {
    return this.map;
  }

  centerMap(): void {
    if (this.map) {
      this.map.setView(this.defaultCenter, this.defaultZoom);
    }
  }

  // Agregar un marcador personalizado
  addMarker(lat: number, lng: number, title: string, iconType?: 'truck' | 'warning' | 'location'): L.Marker {
    const icons = {
      truck: L.divIcon({
        className: 'custom-truck-icon',
        html: '<div style="background: #10b981; color: white; padding: 8px; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 18px;">🚛</div>',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      }),
      warning: L.divIcon({
        className: 'custom-warning-icon',
        html: '<div style="background: #f59e0b; color: white; padding: 8px; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 18px;">⚠️</div>',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      }),
      location: L.divIcon({
        className: 'custom-location-icon',
        html: '<div style="background: #3b82f6; color: white; padding: 8px; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 18px;">📍</div>',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })
    };

    const marker = L.marker([lat, lng], {
      icon: iconType ? icons[iconType] : undefined,
      title: title
    }).addTo(this.map);

    marker.bindPopup(`<div style="text-align: center;"><strong>${title}</strong></div>`);
    
    this.markers.push(marker);
    return marker;
  }

  // Dibujar una ruta entre puntos
  drawRoute(coordinates: L.LatLngExpression[], color: string = '#3b82f6', label?: string): L.Polyline {
    const route = L.polyline(coordinates, {
      color: color,
      weight: 5,
      opacity: 0.8,
      dashArray: '10, 8',
      lineJoin: 'round'
    }).addTo(this.map);

    if (label) {
      route.bindPopup(`<div style="text-align: center;"><strong>${label}</strong></div>`);
    }

    this.routes.push(route);
    return route;
  }

  // Enfocar en un vehículo específico
  focusOnVehicle(vehicleId: string): void {
    console.log('Enfocando vehículo:', vehicleId);
    // Aquí puedes implementar la lógica para buscar el marcador del vehículo
    // Por ahora, centramos en una ubicación de ejemplo
    if (this.map && this.markers.length > 0) {
      const firstMarker = this.markers[0];
      this.map.setView(firstMarker.getLatLng(), 16);
      firstMarker.openPopup();
    }
  }

  // Mostrar todas las rutas
  showAllRoutes(): void {
    if (!this.map) return;
    
    if (this.routes.length > 0) {
      const group = L.featureGroup(this.routes);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    } else {
      console.log('No hay rutas para mostrar');
      this.centerMap();
    }
  }

  // Mostrar todos los vehículos activos
  showActiveVehicles(): void {
    if (!this.map) return;
    
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    } else {
      console.log('No hay vehículos activos para mostrar');
      this.centerMap();
    }
  }

  // Limpiar todos los marcadores
  clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  // Limpiar todas las rutas
  clearRoutes(): void {
    this.routes.forEach(route => route.remove());
    this.routes = [];
  }

  // Limpiar todo (marcadores y rutas)
  clearAll(): void {
    this.clearMarkers();
    this.clearRoutes();
  }

  // Agregar datos de demostración
  private addDemoData(): void {
    // Marcadores de camiones en diferentes zonas de Buenaventura
    this.addMarker(3.8801, -77.0318, 'Camión DEF-456 (M. García)<br>En ruta - 72%', 'truck');
    this.addMarker(3.8951, -77.0218, 'Camión ABC-123<br>Zona Norte', 'truck');
    this.addMarker(3.8651, -77.0418, 'Camión GHI-789<br>Zona Sur', 'truck');
    
    // Marcadores de alertas
    this.addMarker(3.8881, -77.0288, 'Retraso por lluvia<br>Zona Centro', 'warning');
    
    // Puntos de recolección
    this.addMarker(3.8751, -77.0368, 'Punto de Recolección 1', 'location');
    this.addMarker(3.8901, -77.0268, 'Punto de Recolección 2', 'location');

    // Rutas de ejemplo
    const rutaNorte: L.LatLngExpression[] = [
      [3.8801, -77.0318],
      [3.8851, -77.0288],
      [3.8901, -77.0268],
      [3.8951, -77.0218]
    ];
    this.drawRoute(rutaNorte, '#10b981', 'Ruta Norte');

    const rutaSur: L.LatLngExpression[] = [
      [3.8801, -77.0318],
      [3.8751, -77.0368],
      [3.8701, -77.0388],
      [3.8651, -77.0418]
    ];
    this.drawRoute(rutaSur, '#3b82f6', 'Ruta Sur');

    const rutaCentro: L.LatLngExpression[] = [
      [3.8801, -77.0318],
      [3.8831, -77.0298],
      [3.8861, -77.0278],
      [3.8881, -77.0288]
    ];
    this.drawRoute(rutaCentro, '#f59e0b', 'Ruta Centro (Retrasada)');
  }

  // Agregar un círculo (área de cobertura)
  addCircle(lat: number, lng: number, radius: number, color: string = '#3b82f6'): L.Circle {
    const circle = L.circle([lat, lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.2,
      radius: radius
    }).addTo(this.map);

    return circle;
  }

  // Invalidar tamaño (útil cuando el contenedor cambia de tamaño)
  invalidateSize(): void {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    }
  }
}