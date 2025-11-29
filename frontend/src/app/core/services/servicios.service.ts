import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  duracion_minutos: number;
  precio: number;
  estado: string;
  creado_en: string;
}

interface ServiciosResponse {
  ok: boolean;
  servicios: Servicio[];
  mensaje?: string; // 👈 agregamos esto
}


@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET /api/servicios
  obtenerServicios(): Observable<ServiciosResponse> {
    return this.http.get<ServiciosResponse>(`${this.apiUrl}/servicios`);
  }
}
