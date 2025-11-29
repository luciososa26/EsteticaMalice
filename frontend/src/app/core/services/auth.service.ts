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
  providedIn: 'root', // Disponible en toda la app
})
export class AuthService {
  // Tomamos la URL base de la API desde environment
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ===========================
  // Registro de usuario
  // Llama a POST /api/auth/register
  // ===========================
  register(data: {
    nombre_apellido: string;
    email: string;
    password: string;
    telefono?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data);
  }

  // ===========================
  // Login de usuario
  // Llama a POST /api/auth/login
  // ===========================
  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data);
  }

  // ===========================
  // Obtener usuario logueado (ME)
  // GET /api/auth/me
  // Requiere enviar el token en el header (lo veremos después con interceptor)
  // ===========================
  me(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/me`);
  }

  // ===========================
  // Manejo simple de token en localStorage
  // ===========================
private isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

  guardarToken(token: string) {
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

  borrarToken() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }

  estaLogueado(): boolean {
    return this.isBrowser() && !!this.obtenerToken();
  }
}
