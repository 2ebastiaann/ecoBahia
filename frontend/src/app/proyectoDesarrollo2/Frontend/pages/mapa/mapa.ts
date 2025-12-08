import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss']
})
export class MapaComponent implements AfterViewInit, OnDestroy, OnInit {

  map!: L.Map;

  // Modal
  mostrarModalNombreRuta = false;
  nombreRuta = '';
  rutaColor = '#2563eb';

  // Modo creación
  creandoRuta = false;
  puntosRuta: L.LatLng[] = [];
  polyline: L.Polyline | null = null;
  marcadores: (L.Marker | L.CircleMarker)[] = [];

  // Backend
  rutas: any[] = [];
  rutaSeleccionada: any = null;
  private createRequested = false;

  usuario: any;
  esAdmin = false;

  constructor(
    private api: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {

    // Leer usuario y rol
    this.usuario = this.auth.obtenerUsuario();
    if (this.usuario) {
      this.esAdmin = this.usuario.id_rol === 1;
    }

    this.cargarRutas();

    this.route.queryParams.subscribe(params => {
      if (params['create'] && this.esAdmin) {
        this.createRequested = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => this.map.invalidateSize(), 200);

    if (this.createRequested && this.esAdmin) {
      this.mostrarModalNombreRuta = true;
    }
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  // Inicializar mapa
  private initMap(): void {
    this.map = L.map('mapContainer', {
      center: [3.8773, -77.0277],
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
  }

  // Cargar rutas registradas
  private cargarRutas(): void {
    this.api.getRutas().subscribe({
      next: (resp) => {
        const lista = Array.isArray(resp.data) ? resp.data : resp;
        this.rutas = lista.map((r: any) => ({
          ...r,
          shape: typeof r.shape === 'string' ? JSON.parse(r.shape) : r.shape
        }));
      },
      error: err => console.error("Error cargando rutas:", err)
    });
  }

  // Click en mapa (solo admin y solo cuando está creando)
  private onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.creandoRuta || !this.esAdmin) return;

    const p = e.latlng;
    this.puntosRuta.push(p);

    const circle = L.circleMarker(p, {
      radius: 6,
      color: this.rutaColor,
      fillColor: this.rutaColor,
      fillOpacity: 1,
      weight: 2
    }).addTo(this.map);

    this.marcadores.push(circle);

    if (!this.polyline) {
      this.polyline = L.polyline(this.puntosRuta, { color: this.rutaColor, weight: 4 }).addTo(this.map);
    } else {
      this.polyline.setLatLngs(this.puntosRuta);
    }
  }

  // Abrir modal
  empezarCrearRuta(): void {
    if (!this.esAdmin) return;
    this.mostrarModalNombreRuta = true;
  }

  // Confirmar nombre y comenzar
  confirmarNombreRuta(): void {
    if (!this.esAdmin) return;

    if (!this.nombreRuta.trim()) {
      alert("Debe ingresar un nombre.");
      return;
    }

    this.mostrarModalNombreRuta = false;
    this.creandoRuta = true;
    this.limpiarMapa();
  }

  // Guardar ruta
  guardarRuta(): void {
    if (!this.esAdmin) return;

    if (this.puntosRuta.length < 2) {
      alert("Debes marcar al menos 2 puntos.");
      return;
    }

    const shape = {
      type: "LineString",
      coordinates: this.puntosRuta.map(p => [p.lng, p.lat])
    };

    const payload = {
      nombre_ruta: this.nombreRuta,
      color_hex: this.rutaColor,
      shape
    };

    this.api.crearRuta(payload).subscribe({
      next: () => {
        alert("Ruta creada exitosamente ✔");
        this.creandoRuta = false;
        this.limpiarMapa();
        this.nombreRuta = '';
        this.rutaColor = '#2563eb';
        this.mostrarModalNombreRuta = false;
        this.cargarRutas();
      },
      error: err => {
        console.error("Error guardando ruta:", err);
        alert("Error al guardar la ruta");
      }
    });
  }

  // Mostrar ruta registrada
  mostrarRuta(r: any): void {
    this.limpiarMapa();

    const coords = r.shape.coordinates.map((c: [number, number]) => L.latLng(c[1], c[0]));
    const color = r.color_hex || '#10b981';

    this.polyline = L.polyline(coords, { color }).addTo(this.map);

    coords.forEach((p: L.LatLng) => {
      const c = L.circleMarker(p, {
        radius: 6,
        color,
        fillColor: color,
        fillOpacity: 1,
        weight: 2
      }).addTo(this.map);

      this.marcadores.push(c);
    });

    this.map.fitBounds(this.polyline.getBounds(), { padding: [40, 40] });
  }

  limpiarMapa(): void {
    this.puntosRuta = [];

    if (this.polyline) {
      this.map.removeLayer(this.polyline);
      this.polyline = null;
    }

    this.marcadores.forEach(m => this.map.removeLayer(m));
    this.marcadores = [];
  }
}
