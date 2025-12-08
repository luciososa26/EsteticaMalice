import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

// ============================
// MODELOS
// ============================
export interface Turno {
  id: number;
  usuario?: string;   // en admin se usa
  profesional: string;
  servicio: string;
  fecha: string;
  hora: string;       // "11:00:00"
  estado: 'pendiente' | 'confirmado' | 'cancelado';
}

interface CrearTurnoResponse {
  ok: boolean;
  mensaje: string;
  turno?: Turno;
}

interface TurnosResponse {
  ok: boolean;
  turnos: Turno[];
  mensaje?: string;
}

interface CancelarTurnoResponse {
  ok: boolean;
  mensaje: string;
}

export interface TurnosPorFechaResponse {
  ok: boolean;
  turnos: Turno[];
  mensaje?: string;
}

interface ActualizarTurnoResponse {
  ok: boolean;
  mensaje: string;
  turno?: Turno;
}

interface ActualizarTurnoPayload {
  id_servicio?: number;
  id_profesional?: number;
  fecha?: string; // YYYY-MM-DD
  hora?: string;  // HH:mm:ss
  estado?: 'pendiente' | 'confirmado' | 'cancelado';
}

// ============================
// SERVICIO
// ============================
@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ============================
  // CREAR TURNO
  // ============================
  crearTurno(data: {
    id_usuario: number;
    id_servicio: number;
    id_profesional: number;
    fecha: string; // YYYY-MM-DD
    hora: string;  // HH:mm:ss
  }): Observable<CrearTurnoResponse> {
    return this.http.post<CrearTurnoResponse>(`${this.apiUrl}/turnos`, data);
  }

  // ============================
  // TURNOS DE UN USUARIO
  // ============================
  obtenerTurnosUsuario(idUsuario: number): Observable<TurnosResponse> {
    return this.http.get<TurnosResponse>(
      `${this.apiUrl}/turnos/usuario/${idUsuario}`
    );
  }

  // ============================
  // CANCELAR TURNO (cliente o admin)
  // ============================
  cancelarTurno(id: number): Observable<CancelarTurnoResponse> {
    return this.http.put<CancelarTurnoResponse>(
      `${this.apiUrl}/turnos/${id}/cancelar`,
      {}
    );
  }

  // ============================
  // TURNOS POR FECHA (para saber ocupados)
  // ============================
  obtenerTurnosPorFecha(fecha: string): Observable<TurnosPorFechaResponse> {
    return this.http.get<TurnosPorFechaResponse>(
      `${this.apiUrl}/turnos/fecha/${fecha}`
    );
  }

  // ============================
  // NUEVO: obtener TODOS los turnos (admin)
  // ============================
  obtenerTurnosAdmin(): Observable<TurnosResponse> {
    return this.http.get<TurnosResponse>(`${this.apiUrl}/turnos`);
  }
  // ============================
  // ACTUALIZAR TURNO (admin)
  // ============================
  actualizarTurno(
    id: number,
    data: ActualizarTurnoPayload
  ): Observable<ActualizarTurnoResponse> {
    return this.http.put<ActualizarTurnoResponse>(
      `${this.apiUrl}/turnos/${id}`,
      data
    );
  }
}
