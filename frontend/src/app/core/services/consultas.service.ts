import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface ConsultaResponse {
  ok: boolean;
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  enviarConsulta(data: {
    nombre: string;
    email: string;
    telefono?: string;
    mensaje: string;
  }): Observable<ConsultaResponse> {
    return this.http.post<ConsultaResponse>(`${this.apiUrl}/consultas`, data);
  }
}
