import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss']
})
export class MapaComponent implements AfterViewInit, OnDestroy, OnInit {

  map!: L.Map;

  // ====== VARIABLES PARA EL MODAL ======
  mostrarModalNombreRuta = false;
  nombreRuta = '';
  rutaColor = '#2563eb';

  // ====== MODO CREACIÓN ======
  creandoRuta = false;
  puntosRuta: L.LatLng[] = [];
  polyline: L.Polyline | null = null;
  marcadores: (L.Marker | L.CircleMarker)[] = [];

  // ====== RUTAS DEL BACKEND ======
  rutas: any[] = [];
  rutaSeleccionada: any = null;
  // Flag para indicar que debemos iniciar creación al cargar el mapa
  private createRequested = false;

  readonly PERFIL_ID = 'a4cdc1ca-5e37-40b1-8a4b-d26237e25142';

  constructor(
    private api: ApiService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarRutas();

    // Si venimos con ?create=1, marcamos la petición para iniciar creación
    this.route.queryParams.subscribe(params => {
      if (params['create']) {
        this.createRequested = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => this.map.invalidateSize(), 200);
    // Si se solicitó crear ruta antes de inicializar, mostramos el modal
    // para que el usuario ingrese nombre y color antes de dibujar
    if (this.createRequested) {
      this.mostrarModalNombreRuta = true;
    }
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  // ---------------------------------------------
  // INICIALIZAR MAPA
  // ---------------------------------------------
  private initMap(): void {
    this.map = L.map('mapContainer', {
      center: [3.8773, -77.0277],
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
  }

  // ---------------------------------------------
  // CARGAR RUTAS DEL BACKEND
  // ---------------------------------------------
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

  // ---------------------------------------------
  // CLICK EN MAPA (MODO CREACIÓN)
  // ---------------------------------------------
  private onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.creandoRuta) return;

    const p = e.latlng;
    this.puntosRuta.push(p);

    // Usar un marcador circular bonito en lugar del icono por defecto
    const circle = L.circleMarker(p, {
      radius: 6,
      color: this.rutaColor,
      fillColor: this.rutaColor,
      fillOpacity: 1,
      weight: 2
    }).addTo(this.map);
    this.marcadores.push(circle);

    if (!this.polyline) {
      this.polyline = L.polyline(this.puntosRuta, { color: this.rutaColor, weight: 4 })
        .addTo(this.map);
    } else {
      this.polyline.setLatLngs(this.puntosRuta);
    }
  }

  // ---------------------------------------------
  // ABRIR MODAL PARA NOMBRE
  // ---------------------------------------------
  empezarCrearRuta(): void {
    this.mostrarModalNombreRuta = true;
  }

  confirmarNombreRuta(): void {
    if (!this.nombreRuta.trim()) {
      alert("Debe ingresar un nombre para la ruta.");
      return;
    }

    this.mostrarModalNombreRuta = false;
    this.creandoRuta = true;

    this.limpiarMapa();
  }

  // ---------------------------------------------
  // GUARDAR RUTA EN BACKEND
  // ---------------------------------------------
  guardarRuta(): void {
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
      next: (res) => {
        console.log('crearRuta response', res);
        // Verificar estado del servidor antes de crear
        this.api.getRutas().subscribe({ next: (before) => console.log('rutas before create', before), error: e => console.warn('getRutas before failed', e) });
        alert("Ruta creada exitosamente ✔");
        // Stop creation and reset UI like the vehículos flow
        this.creandoRuta = false;
        this.limpiarMapa();
        this.nombreRuta = '';
        this.rutaColor = '#2563eb';
        this.mostrarModalNombreRuta = false;
        this.cargarRutas();
        // Verificar estado del servidor después de crear
        this.api.getRutas().subscribe({ next: (after) => console.log('rutas after create', after), error: e => console.warn('getRutas after failed', e) });
      },
      error: (err) => {
        console.error("Error guardando ruta:", err);
        alert('Error al guardar la ruta');
      }
    });
  }

  // ---------------------------------------------
  // MOSTRAR RUTA GUARDADA
  // ---------------------------------------------
  mostrarRuta(r: any): void {
    this.limpiarMapa();

    const coords = r.shape.coordinates.map(
      (c: [number, number]) => L.latLng(c[1], c[0])
    );

    const color = r.color_hex || '#10b981';
    this.polyline = L.polyline(coords, { color: color })
      .addTo(this.map);

    coords.forEach((p: L.LatLng) => {
      const c = L.circleMarker(p, {
        radius: 6,
        color: color,
        fillColor: color,
        fillOpacity: 1,
        weight: 2
      }).addTo(this.map);
      this.marcadores.push(c);
    });

    this.map.fitBounds(this.polyline.getBounds(), { padding: [40, 40] });
  }

  // ---------------------------------------------
  // LIMPIAR MAPA
  // ---------------------------------------------
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
