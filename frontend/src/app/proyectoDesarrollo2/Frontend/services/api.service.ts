import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// ========= TIPOS PARA RUTAS =========
export interface RutaShape {
  type: 'LineString';
  coordinates: [number, number][]; // [lng, lat]
}

export interface CrearRutaPayload {
  nombre_ruta: string;
  perfil_id: string;
  color_hex: string;          // ✔ NECESARIO
  shape: RutaShape;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.PROF_API_BASE_URL;
  private _perfilId = environment.PERFIL_ID;

  // Getter
  get perfilId(): string {
    return this._perfilId;
  }

  constructor(private http: HttpClient) {}

  // ======================================================
  // 🚗 VEHÍCULOS (NO SE BORRA NADA)
  // ======================================================

  getVehiculos(): Observable<any> {
    const params = new HttpParams().set('perfil_id', this._perfilId);
    return this.http.get<any[]>(`${this.baseUrl}/vehiculos`, { params });
  }

  crearVehiculo(vehiculo: any): Observable<any> {
    const body = { ...vehiculo, perfil_id: this._perfilId };
    return this.http.post(`${this.baseUrl}/vehiculos`, body);
  }

  actualizarVehiculo(id: string, vehiculo: any): Observable<any> {
    const body = { ...vehiculo, perfil_id: this._perfilId };
    return this.http.put(`${this.baseUrl}/vehiculos/${id}`, body);
  }

  eliminarVehiculo(id: string): Observable<any> {
    const params = new HttpParams().set('perfil_id', this._perfilId);
    return this.http.delete(`${this.baseUrl}/vehiculos/${id}`, { params });
  }

  // ======================================================
  // 📍 RUTAS
  // ======================================================

  getRutas(): Observable<any> {
    const params = new HttpParams().set('perfil_id', this._perfilId);
    return this.http.get<any>(`${this.baseUrl}/rutas`, { params });
  }

  crearRuta(payload: CrearRutaPayload): Observable<any> {
    console.log("📤 Enviando ruta a API:", payload);
    console.log("📤 shape.coordinates.length =", payload.shape.coordinates.length, "puntos");
    console.log("📤 shape stringificado:", JSON.stringify(payload.shape));
    
    // El backend del profe podría esperar shape como string, no como objeto
    const body = {
      perfil_id: payload.perfil_id,
      nombre_ruta: payload.nombre_ruta,
      color_hex: payload.color_hex,
      shape: JSON.stringify(payload.shape)  // Asegurar que es string
    };
    
    console.log("📤 Body final que se envía:", body);
    
    return this.http.post<any>(`${this.baseUrl}/rutas`, body).pipe(
      tap((res: any) => {
        console.log("✅ crearRuta response completa:", res);
        if (res?.data?.shape) {
          const receivedShape = typeof res.data.shape === 'string' ? JSON.parse(res.data.shape) : res.data.shape;
          console.log("✅ shape en response tiene", receivedShape.coordinates?.length || 0, "puntos");
        }
      })
    );
  }

  eliminarRuta(id: string): Observable<any> {
    const params = new HttpParams().set('perfil_id', this._perfilId);
    return this.http.delete(`${this.baseUrl}/rutas/${id}`, { params });
  }
}
