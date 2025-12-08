import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion_minutos?: number;
  estado?: string;
  imagen_url?: string;
}

export interface ServicioUpdateEstadoResponse {
  ok: boolean;
  mensaje?: string;
  servicio?: Servicio;
}


export interface ServiciosResponse {
  ok: boolean;
  servicios: Servicio[];
  mensaje?:string;
}

export interface ServicioDetalleResponse {
  ok: boolean;
  servicio: Servicio;
  mensaje?:string;
}

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerServicios(): Observable<ServiciosResponse> {
    return this.http.get<ServiciosResponse>(`${this.apiUrl}/servicios`);
  }
  obtenerServiciosAdmin(): Observable<ServiciosResponse> {
  return this.http.get<ServiciosResponse>(`${this.apiUrl}/servicios/admin`);
  }


  // 👉 Nuevo: obtener un servicio por ID
  obtenerServicioPorId(id: number): Observable<ServicioDetalleResponse> {
    return this.http.get<ServicioDetalleResponse>(
      `${this.apiUrl}/servicios/${id}`
    );
  }
  cambiarEstadoServicio(
    id: number,
    estado: 'activo' | 'inactivo'
  ): Observable<ServicioUpdateEstadoResponse> {
    return this.http.put<ServicioUpdateEstadoResponse>(
      `${this.apiUrl}/servicios/${id}/estado`,
      { estado }
  );
}

}
