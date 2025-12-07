import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Profesional {
  id: number;
  nombre_apellido: string;
  especialidad?: string;
  telefono?: string;
  estado: 'activo' | 'inactivo';
}

interface ProfesionalesResponse {
  ok: boolean;
  profesionales: Profesional[];
  mensaje?: string;
}

interface ProfesionalResponse {
  ok: boolean;
  profesional?: Profesional;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfesionalesService {
  private apiUrl = `${environment.apiUrl}/profesionales`;

  constructor(private http: HttpClient) {}

  obtenerProfesionales(): Observable<ProfesionalesResponse> {
    return this.http.get<ProfesionalesResponse>(this.apiUrl);
  }

  obtenerProfesionalPorId(id: number): Observable<ProfesionalResponse> {
    return this.http.get<ProfesionalResponse>(`${this.apiUrl}/${id}`);
  }

  crearProfesional(data: {
    nombre_apellido: string;
    especialidad?: string;
    telefono?: string;
    estado: 'activo' | 'inactivo';
  }): Observable<ProfesionalResponse> {
    return this.http.post<ProfesionalResponse>(this.apiUrl, data);
  }

  actualizarProfesional(
    id: number,
    data: {
      nombre_apellido: string;
      especialidad?: string;
      telefono?: string;
      estado: 'activo' | 'inactivo';
    }
  ): Observable<ProfesionalResponse> {
    return this.http.put<ProfesionalResponse>(`${this.apiUrl}/${id}`, data);
  }
}
