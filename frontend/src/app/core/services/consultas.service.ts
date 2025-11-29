import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface CrearConsultaBody {
  nombre_apellido: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

export interface CrearConsultaResponse {
  ok: boolean;
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  crearConsulta(body: CrearConsultaBody): Observable<CrearConsultaResponse> {
    return this.http.post<CrearConsultaResponse>(
      `${this.apiUrl}/consultas`,
      body
    );
  }
}
