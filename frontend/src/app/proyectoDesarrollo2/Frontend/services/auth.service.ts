import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  ok: boolean;
  token: string;
  usuario: {
    id_usuario: string;
    email: string;
    id_rol: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 🔥 RUTA CORRECTA DEL BACKEND
  private apiUrl = `${environment.API_BASE_URL}/usuarios`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  register(email: string, password: string, id_rol: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, id_rol });
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
