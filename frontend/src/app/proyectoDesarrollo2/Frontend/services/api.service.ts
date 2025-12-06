import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.PROF_API_BASE_URL;
  private perfilId = environment.PERFIL_ID;

  constructor(private http: HttpClient) {}

  // ==========================================
  //                VEHÍCULOS
  // ==========================================
  getVehiculos(): Observable<any> {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.get<any[]>(`${this.baseUrl}/vehiculos`, { params });
  }

  crearVehiculo(vehiculo: any): Observable<any> {
    const body = { ...vehiculo, perfil_id: this.perfilId };
    return this.http.post(`${this.baseUrl}/vehiculos`, body);
  }

  actualizarVehiculo(id: string, vehiculo: any): Observable<any> {
    const body = { ...vehiculo, perfil_id: this.perfilId };
    return this.http.put(`${this.baseUrl}/vehiculos/${id}`, body);
  }

  eliminarVehiculo(id: string): Observable<any> {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.delete(`${this.baseUrl}/vehiculos/${id}`, { params });
  }

  // ==========================================
  //                    RUTAS
  // ==========================================

  getRutas(): Observable<any> {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.get<any[]>(`${this.baseUrl}/rutas`, { params });
  }

  /** 
   * Crear ruta --- API del profe requiere:
   * - nombre_ruta
   * - perfil_id
   * - color_hex
   * - shape (string)
   */
  crearRuta(data: { nombre_ruta: string; color_hex: string; shape: any }): Observable<any> {

    const body = {
      perfil_id: this.perfilId,
      nombre_ruta: data.nombre_ruta,
      color_hex: data.color_hex,
      shape: JSON.stringify(data.shape)
    };

    return this.http.post(`${this.baseUrl}/rutas`, body);
  }

  eliminarRuta(id: string): Observable<any> {
    const params = new HttpParams().set('perfil_id', this.perfilId);
    return this.http.delete(`${this.baseUrl}/rutas/${id}`, { params });
  }

}
