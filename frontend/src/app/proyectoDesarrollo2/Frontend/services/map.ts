import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class LeafletMapService {

  private map: L.Map | null = null;

  /**
   * Inicializa el mapa en el contenedor indicado
   */
  initMap(containerId: string, center: L.LatLngExpression = [3.42158, -76.5205], zoom: number = 13): void {
    if (this.map) return;

    this.map = L.map(containerId).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
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
   * Quita todas las capas excepto el mapa base
   */
  clearMap(): void {
    if (!this.map) return;

    this.map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) return; // deja la capa base
      this.map!.removeLayer(layer);
    });
  }

  /**
   * Corrige el problema de los cuadros blancos (tiles sin cargar)
   */
  resizeMap(): void {
    if (this.map) {
      setTimeout(() => {
        this.map!.invalidateSize();
      }, 200);
    }
  }
}

