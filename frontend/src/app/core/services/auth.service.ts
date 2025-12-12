import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface AuthResponse {
  ok: boolean;
  mensaje: string;
  token?: string;
  usuario?: {
    id: number;
    nombre_apellido: string;
    email: string;
    rol: string;            // ← importante para el admin.guard
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ====================================
  //  REGISTRO
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
  // ====================================
  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data);
  }

  // ====================================
  //  ME — Obtener usuario logueado
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
    if (this.isBrowser()) localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  guardarUsuario(usuario: any): void {
    if (this.isBrowser()) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
  }

  obtenerUsuario(): any | null {
    if (!this.isBrowser()) return null;

    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  getRol(): string | null {
    const usuario = this.obtenerUsuario();
    return usuario?.rol ?? null;
  }

  isAdmin(): boolean {
    return this.getRol() === 'ADMIN';
  }

  borrarTodo(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  logout(): void {
    this.borrarTodo();
  }

  estaLogueado(): boolean {
    return !!this.obtenerToken();
  }
}
