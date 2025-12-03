import { Injectable } from '@angular/core';
import * as L from 'leaflet';

export interface SavedRoute {
  id: string;
  nombre: string;
  color: string;
  polyline: L.Polyline;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class LeafletMapService {

  private map: L.Map | null = null;
  private savedRoutes: SavedRoute[] = [];
  private routeMarkers: L.Marker[] = [];

  /**
   * Inicializa el mapa en el contenedor indicado
   */
  initMap(containerId: string, center: L.LatLngExpression = [3.8801, -77.0318], zoom: number = 13): void {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map(containerId).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Fix para los iconos por defecto de Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
    });
  }

  /**
   * Obtiene la instancia del mapa
   */
  getMap(): L.Map | null {
    return this.map;
  }

  /**
   * Agrega una capa GeoJSON al mapa
   */
  addGeoJsonLayer(geojson: any): void {
    if (!this.map) return;

    const layer = L.geoJSON(geojson, {
      style: {
        color: '#ff6600',
        weight: 3,
        opacity: 0.9
      }
    });

    layer.addTo(this.map);
    this.map.fitBounds(layer.getBounds());
  }

  /**
   * Dibuja una ruta en el mapa y la guarda
   */
  drawRoute(
    coordinates: L.LatLngExpression[], 
    options: {
      id: string;
      nombre: string;
      color?: string;
      weight?: number;
      dashArray?: string;
      data?: any;
    }
  ): L.Polyline {
    if (!this.map) {
      throw new Error('El mapa no está inicializado');
    }

    const polyline = L.polyline(coordinates, {
      color: options.color || '#10b981',
      weight: options.weight || 5,
      opacity: 0.8,
      dashArray: options.dashArray || '10, 8',
      lineJoin: 'round'
    }).addTo(this.map);

    // Agregar popup con información
    polyline.bindPopup(`
      <div style="text-align: center; min-width: 150px;">
        <strong style="font-size: 1rem; color: #1f2937;">${options.nombre}</strong>
        ${options.data?.zonaAsignada ? `<br><small style="color: #6b7280;">Zona: ${options.data.zonaAsignada}</small>` : ''}
        ${options.data?.distanciaEstimada ? `<br><small style="color: #6b7280;">Distancia: ${options.data.distanciaEstimada} km</small>` : ''}
      </div>
    `);

    // Guardar la ruta
    this.savedRoutes.push({
      id: options.id,
      nombre: options.nombre,
      color: options.color || '#10b981',
      polyline: polyline,
      data: options.data
    });

    return polyline;
  }

  /**
   * Agrega marcadores para los puntos de una ruta
   */
  addRouteMarkers(
    puntoInicio: { lat: number; lng: number; name: string },
    puntoFin: { lat: number; lng: number; name: string },
    puntosIntermedios?: { lat: number; lng: number; name: string }[]
  ): void {
    if (!this.map) return;

    // Marcador de inicio (verde)
    const inicioIcon = L.divIcon({
      className: 'custom-route-marker',
      html: `<div style="background: #10b981; color: white; padding: 8px; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 18px;">🟢</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const inicioMarker = L.marker([puntoInicio.lat, puntoInicio.lng], { icon: inicioIcon })
      .addTo(this.map)
      .bindPopup(`<strong>Inicio:</strong><br>${puntoInicio.name}`);
    
    this.routeMarkers.push(inicioMarker);

    // Marcadores intermedios (azul)
    if (puntosIntermedios) {
      puntosIntermedios.forEach((punto, index) => {
        const intermedioIcon = L.divIcon({
          className: 'custom-route-marker',
          html: `<div style="background: #3b82f6; color: white; padding: 8px; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px; font-weight: bold;">${index + 1}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([punto.lat, punto.lng], { icon: intermedioIcon })
          .addTo(this.map!)
          .bindPopup(`<strong>Punto ${index + 1}:</strong><br>${punto.name}`);
        
        this.routeMarkers.push(marker);
      });
    }

    // Marcador de fin (rojo)
    const finIcon = L.divIcon({
      className: 'custom-route-marker',
      html: `<div style="background: #ef4444; color: white; padding: 8px; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 18px;">🔴</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const finMarker = L.marker([puntoFin.lat, puntoFin.lng], { icon: finIcon })
      .addTo(this.map)
      .bindPopup(`<strong>Fin:</strong><br>${puntoFin.name}`);
    
    this.routeMarkers.push(finMarker);
  }

  /**
   * Obtiene todas las rutas guardadas
   */
  getSavedRoutes(): SavedRoute[] {
    return this.savedRoutes;
  }

  /**
   * Obtiene una ruta específica por ID
   */
  getRouteById(id: string): SavedRoute | undefined {
    return this.savedRoutes.find(route => route.id === id);
  }

  /**
   * Elimina una ruta del mapa
   */
  removeRoute(routeId: string): void {
    if (!this.map) return;

    const routeIndex = this.savedRoutes.findIndex(r => r.id === routeId);
    if (routeIndex !== -1) {
      this.map.removeLayer(this.savedRoutes[routeIndex].polyline);
      this.savedRoutes.splice(routeIndex, 1);
    }
  }

  /**
   * Muestra u oculta una ruta
   */
  toggleRouteVisibility(routeId: string, visible: boolean): void {
    if (!this.map) return;

    const route = this.savedRoutes.find(r => r.id === routeId);
    if (route) {
      if (visible) {
        route.polyline.addTo(this.map);
      } else {
        this.map.removeLayer(route.polyline);
      }
    }
  }

  /**
   * Centra el mapa en una ruta específica
   */
  focusOnRoute(routeId: string): void {
    if (!this.map) return;

    const route = this.savedRoutes.find(r => r.id === routeId);
    if (route) {
      this.map.fitBounds(route.polyline.getBounds(), { padding: [50, 50] });
      route.polyline.openPopup();
    }
  }

  /**
   * Muestra todas las rutas guardadas
   */
  showAllRoutes(): void {
    if (!this.map || this.savedRoutes.length === 0) return;

    const bounds = L.latLngBounds([]);
    this.savedRoutes.forEach(route => {
      bounds.extend(route.polyline.getBounds());
      route.polyline.addTo(this.map!);
    });

    this.map.fitBounds(bounds, { padding: [50, 50] });
  }

  /**
   * Quita todas las capas excepto el mapa base
   */
  clearMap(): void {
    if (!this.map) return;

    this.map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) return;
      this.map!.removeLayer(layer);
    });

    this.savedRoutes = [];
    this.routeMarkers = [];
  }

  /**
   * Limpia los marcadores de ruta
   */
  clearRouteMarkers(): void {
    if (!this.map) return;

    this.routeMarkers.forEach(marker => {
      this.map!.removeLayer(marker);
    });
    this.routeMarkers = [];
  }

  /**
   * Limpia todas las rutas guardadas
   */
  clearAll(): void {
    this.clearMap();
  }

  /**
   * Corrige el problema de los cuadros blancos (tiles sin cargar)
   */
  resizeMap(): void {
    this.invalidateSize();
  }

  /**
   * Invalida el tamaño del mapa (útil cuando el contenedor cambia)
   */
  invalidateSize(): void {
    if (this.map) {
      setTimeout(() => {
        this.map!.invalidateSize();
      }, 200);
    }
  }

  /**
   * Centra el mapa en las coordenadas por defecto
   */
  centerMap(): void {
    if (this.map) {
      this.map.setView([3.8801, -77.0318], 13);
    }
  }
}