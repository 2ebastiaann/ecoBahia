import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

import { ApiService, RutaShape, CrearRutaPayload } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationContainerComponent } from '../../components/notification-container/notification-container.component';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NotificationContainerComponent],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss']
})
export class MapaComponent implements AfterViewInit, OnDestroy, OnInit {

  map!: L.Map;

  // Modal
  mostrarModalNombreRuta = false;
  nombreRuta = '';
  rutaColor = '#2563eb';

  // Crear rutas manualmente con puntos
  creandoRuta = false;
  puntosRuta: L.LatLng[] = [];
  polyline: L.Polyline | null = null;
  marcadores: L.CircleMarker[] = [];

  // rutas cargadas
  rutas: any[] = [];
  rutaSeleccionada: any = null;

  usuario: any;
  esAdmin = false;

  constructor(
    private api: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private notificationService: NotificationService
  ) {}

  // ===================================================
  // Inicialización
  // ===================================================

  ngOnInit(): void {
    this.usuario = this.auth.obtenerUsuario();
    if (this.usuario) {
      this.esAdmin = this.usuario.id_rol === 1;
    }

    this.cargarRutas();
  }

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => this.map.invalidateSize(), 200);
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  // ===================================================
  // Map
  // ===================================================

  private initMap(): void {
    this.map = L.map('mapContainer', {
      center: [3.8773, -77.0277],
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
  }

  // ===================================================
  // Cargar rutas desde API
  // ===================================================

  private cargarRutas(): void {
    this.api.getRutas().subscribe({
      next: (resp: any) => {
        const lista = Array.isArray(resp?.data) ? resp.data : resp;

        this.rutas = lista.map((r: any) => {
          let shape = typeof r.shape === 'string' ? JSON.parse(r.shape) : r.shape;
          
          // ⚠️ El backend transforma LineString a MultiLineString
          // Si es MultiLineString, extraer las coordenadas correctamente
          if (shape.type === 'MultiLineString' && shape.coordinates.length > 0) {
            // MultiLineString: coordinates = [ [line1], [line2], ... ]
            // Concatenar todas las líneas en una sola
            const allCoords: [number, number][] = [];
            shape.coordinates.forEach((line: [number, number][]) => {
              allCoords.push(...line);
            });
            shape = {
              type: 'LineString',
              coordinates: allCoords
            };
          }
          
          return {
            ...r,
            shape: shape
          };
        });
        
        // Log detallado de cada ruta
        console.log("📥 Rutas cargadas del servidor:", lista.length);
        this.rutas.forEach((r, i) => {
          console.log(`  Ruta ${i}: "${r.nombre_ruta}"`);
          console.log(`    - Puntos: ${r.shape?.coordinates?.length || 0}`);
          console.log(`    - color_hex: ${r.color_hex}`);
          console.log(`    - Color que se mostrará: ${r.color_hex || '#10b981 (verde por defecto)'}`);
          console.log(`    - Objeto completo:`, r);
        });
      },
      error: (err: any) => console.error("❌ Error cargando rutas:", err)
    });
  }

  // ===================================================
  // Crear rutas
  // ===================================================

  empezarCrearRuta(): void {
    if (!this.esAdmin) return;
    this.mostrarModalNombreRuta = true;
  }

  confirmarNombreRuta(): void {
    if (!this.esAdmin) return;

    if (!this.nombreRuta.trim()) {
      this.notificationService.warning("Debe ingresar un nombre.");
      return;
    }

    this.creandoRuta = true;
    this.mostrarModalNombreRuta = false;
    this.limpiarMapa();
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.creandoRuta || !this.esAdmin) return;

    const punto = e.latlng;
    this.puntosRuta.push(punto);

    const marker = L.circleMarker(punto, {
      radius: 6,
      color: this.rutaColor,
      fillColor: this.rutaColor,
      fillOpacity: 1,
      weight: 2
    }).addTo(this.map);

    this.marcadores.push(marker);

    if (!this.polyline) {
      this.polyline = L.polyline(this.puntosRuta, {
        color: this.rutaColor,
        weight: 4
      }).addTo(this.map);
    } else {
      this.polyline.setLatLngs(this.puntosRuta);
    }
  }

  // ===================================================
  // Guardar ruta
  // ===================================================

  guardarRuta(): void {
    if (!this.esAdmin) return;

    console.log(`🔍 [guardarRuta] puntosRuta.length = ${this.puntosRuta.length}, creandoRuta = ${this.creandoRuta}`);

    if (this.puntosRuta.length < 2) {
      this.notificationService.warning("Debes marcar al menos 2 puntos.");
      return;
    }

    const shape: RutaShape = {
      type: 'LineString',
      coordinates: this.puntosRuta.map(
        (p: L.LatLng): [number, number] => [p.lng, p.lat]
      )
    };

    const payload: CrearRutaPayload = {
      perfil_id: this.api.perfilId,
      nombre_ruta: this.nombreRuta,
      color_hex: this.rutaColor,   // ← IMPORTANTE
      shape
    };

    console.log("📤 Payload enviado:", payload);
    console.log("📤 puntosRuta array completo:", this.puntosRuta);
    console.log("📤 coordinates:", shape.coordinates);

    this.api.crearRuta(payload).subscribe({
      next: () => {
        this.notificationService.success("Ruta creada exitosamente ✓");
        
        // Guardar la ruta recién creada en memoria para mostrarla sin esperar GET
        const rutaLocal = {
          nombre_ruta: this.nombreRuta,
          color_hex: this.rutaColor,
          shape: shape,
          id: Date.now().toString() // ID temporal
        };
        
        this.rutas.push(rutaLocal);
        console.log("✅ Ruta añadida a lista local (en espera de que el backend devuelva datos completos)");
        
        this.creandoRuta = false;
        this.nombreRuta = '';
        this.rutaColor = '#2563eb';
        this.limpiarMapa();
        
        // Recargar desde el servidor (para actualizaciones de otros usuarios)
        setTimeout(() => this.cargarRutas(), 1000);
      },
      error: (err: any) => {
        console.error("❌ Error guardando ruta:", err);
        this.notificationService.error("Error al guardar la ruta");
      }
    });
  }

  // ===================================================
  // Ver ruta
  // ===================================================

  mostrarRuta(r: any): void {
    if (!r.shape?.coordinates || r.shape.coordinates.length < 2) {
      this.notificationService.error("Ruta dañada o incompleta.");
      return;
    }

    // Primero limpiar el mapa
    this.limpiarMapa();

    // Luego dibujar
    const coords = r.shape.coordinates.map(
      (c: [number, number]) => L.latLng(c[1], c[0])
    );

    this.polyline = L.polyline(coords, {
      color: r.color_hex || '#10b981',
      weight: 5
    }).addTo(this.map);

    // Dibujar puntos
    coords.forEach((p: L.LatLng) => {
      const m = L.circleMarker(p, {
        radius: 6,
        color: r.color_hex || '#10b981',
        fillColor: r.color_hex || '#10b981',
        fillOpacity: 1,
        weight: 2
      }).addTo(this.map);

      this.marcadores.push(m);
    });

    setTimeout(() => {
      this.map.invalidateSize();
      this.map.fitBounds(this.polyline!.getBounds(), { padding: [40, 40] });
    }, 150);
  }

  // ===================================================
  // Limpiar
  // ===================================================

  limpiarMapa(): void {
    console.log('🧹 [limpiarMapa] limpiando', this.puntosRuta.length, 'puntos');
    this.puntosRuta = [];

    if (this.polyline) {
      this.map.removeLayer(this.polyline);
      this.polyline = null;
    }

    this.marcadores.forEach(m => this.map.removeLayer(m));
    this.marcadores = [];
  }
}
