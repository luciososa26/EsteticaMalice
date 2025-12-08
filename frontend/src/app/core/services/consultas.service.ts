import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Consulta {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje: string;
  estado: 'pendiente' | 'respondida';
  creado_en?: string;
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

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ===========================
  // PÚBLICO: enviar consulta
  // (si ya lo tenías, adaptá el tipo para que coincida)
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
  // body: { estado: 'pendiente' | 'respondida' }
  // ===========================
  cambiarEstadoConsulta(
    id: number,
    estado: 'pendiente' | 'respondida'
  ): Observable<CrearConsultaResponse> {
    return this.http.put<CrearConsultaResponse>(
      `${this.apiUrl}/consultas/${id}/estado`,
      { estado }
    );
  }
}
