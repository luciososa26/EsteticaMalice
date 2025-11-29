import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Profesional {
  id: number;
  nombre_apellido: string;
  especialidad: string | null;
  telefono: string | null;
  estado: string;
  creado_en: string;
}

interface ProfesionalesResponse {
  ok: boolean;
  profesionales: Profesional[];
  mensaje?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfesionalesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerProfesionales(): Observable<ProfesionalesResponse> {
    return this.http.get<ProfesionalesResponse>(`${this.apiUrl}/profesionales`);
  }
}
