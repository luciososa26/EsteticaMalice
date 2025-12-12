import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export type EstadoConsulta = 'pendiente' | 'respondida' | 'archivada';

export interface Consulta {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje: string;
  estado: EstadoConsulta;
  creado_en?: string; // o fecha_envio según cómo lo devuelva el backend
}

export interface CrearConsultaResponse {
  ok: boolean;
  mensaje: string;
  consulta?: Consulta;
}

export interface ConsultasResponse {
  ok: boolean;
  consultas: Consulta[];
  mensaje?: string;
}

export interface CambiarEstadoConsultaResponse {
  ok: boolean;
  mensaje: string;
  consulta?: Consulta;
}

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ===========================
  // PÚBLICO: enviar consulta
  // POST /api/consultas
  // ===========================
  enviarConsulta(data: {
    nombre: string;
    email: string;
    telefono?: string;
    mensaje: string;
  }): Observable<CrearConsultaResponse> {
    return this.http.post<CrearConsultaResponse>(
      `${this.apiUrl}/consultas`,
      data
    );
  }

  // ===========================
  // ADMIN: listar todas las consultas
  // GET /api/consultas
  // ===========================
  obtenerConsultas(): Observable<ConsultasResponse> {
    return this.http.get<ConsultasResponse>(`${this.apiUrl}/consultas`);
  }

  // ===========================
  // ADMIN: cambiar estado
  // PUT /api/consultas/:id/estado
  // body: { estado: 'pendiente' | 'respondida' | 'archivada' }
  // ===========================
  cambiarEstadoConsulta(
    id: number,
    estado: EstadoConsulta
  ): Observable<CambiarEstadoConsultaResponse> {
    return this.http.put<CambiarEstadoConsultaResponse>(
      `${this.apiUrl}/consultas/${id}/estado`,
      { estado }
    );
  }
}
