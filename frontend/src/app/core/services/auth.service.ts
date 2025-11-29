import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

// Interfaz opcional para tipar la respuesta de login/register
interface AuthResponse {
  ok: boolean;
  mensaje: string;
  token?: string;
  usuario?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ====================================
  //  REGISTRO
  //  POST /api/auth/register
  // ====================================
  register(data: {
    nombre_apellido: string;
    email: string;
    password: string;
    telefono?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data);
  }

  // ====================================
  //  LOGIN
  //  POST /api/auth/login
  // ====================================
  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data);
  }

  // ====================================
  //  ME — Obtener usuario logueado
  //  GET /api/auth/me
  // ====================================
  me(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/me`);
  }

  // ====================================
  //  LOCAL STORAGE SAFE ACCESS
  // ====================================
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  guardarToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  obtenerToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }

  borrarToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }

  // ====================================
  //  LOGOUT
  // ====================================
  logout(): void {
    this.borrarToken();
  }

  // ====================================
  //  ESTADO
  // ====================================
  estaLogueado(): boolean {
    return !!this.obtenerToken();
  }
}
