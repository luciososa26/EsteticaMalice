import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Turno {
  id: number;
  usuario?: string;
  profesional: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: string;
}

interface CrearTurnoResponse {
  ok: boolean;
  mensaje: string;
  turno?: any;
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

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // POST /api/turnos
  crearTurno(data: {
    id_usuario: number;
    id_servicio: number;
    id_profesional: number;
    fecha: string; // YYYY-MM-DD
    hora: string;  // HH:mm:ss
  }): Observable<CrearTurnoResponse> {
    return this.http.post<CrearTurnoResponse>(`${this.apiUrl}/turnos`, data);
  }

  // GET /api/turnos/usuario/:idUsuario
  obtenerTurnosUsuario(idUsuario: number): Observable<TurnosResponse> {
    return this.http.get<TurnosResponse>(
      `${this.apiUrl}/turnos/usuario/${idUsuario}`
    );
  }

  // 👇 NUEVO: cancelar turno
  // Ajustá la ruta si tu backend usa otra:
  // por ejemplo: `${this.apiUrl}/turnos/cancelar/${id}`
  cancelarTurno(id: number): Observable<CancelarTurnoResponse> {
    return this.http.put<CancelarTurnoResponse>(
      `${this.apiUrl}/turnos/${id}/cancelar`,
      {}
    );
  }
  obtenerTurnosPorFecha(fecha: string): Observable<TurnosPorFechaResponse> {
    return this.http.get<TurnosPorFechaResponse>(
      `${this.apiUrl}/turnos/fecha/${fecha}`
    );
  }
}
