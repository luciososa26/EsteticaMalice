import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ServiciosService,
  Servicio,
} from '../../../core/services/servicios.service';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-servicios.component.html',
  styleUrls: ['./admin-servicios.component.scss'],
})
export class AdminServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  cargando = false;
  errorMsg = '';
  mensajeOk = '';
  cambiandoId: number | null = null;

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  // Carga TODOS los servicios (activos e inactivos) para el panel admin
  cargarServicios(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.mensajeOk = '';

    this.serviciosService.obtenerServiciosAdmin().subscribe({
      next: (resp) => {
        if (resp.ok && resp.servicios) {
          this.servicios = resp.servicios;
        } else {
          this.errorMsg =
            resp.mensaje || 'No se pudieron cargar los servicios.';
        }
      },
      error: (err) => {
        console.error('Error al obtener servicios (admin):', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al obtener la lista de servicios.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }

  // Cambiar estado: activo <-> inactivo
  toggleEstado(servicio: Servicio): void {
    this.mensajeOk = '';
    this.errorMsg = '';

    // Cambia entre activo <-> inactivo
    const nuevoEstado: 'activo' | 'inactivo' =
      servicio.estado === 'activo' ? 'inactivo' : 'activo';

    const confirmMsg =
      nuevoEstado === 'inactivo'
        ? `¿Seguro que querés pausar el servicio "${servicio.nombre}"?`
        : `¿Seguro que querés activar nuevamente el servicio "${servicio.nombre}"?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    this.cambiandoId = servicio.id;

    this.serviciosService
      .cambiarEstadoServicio(servicio.id, nuevoEstado)
      .subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.mensajeOk =
              resp.mensaje || 'Estado actualizado correctamente.';

            if (resp.servicio) {
              this.servicios = this.servicios.map((s) =>
                s.id === servicio.id ? { ...s, ...resp.servicio } : s
              );
            } else {
              this.servicios = this.servicios.map((s) =>
                s.id === servicio.id ? { ...s, estado: nuevoEstado } : s
              );
            }
          } else {
            this.errorMsg = resp.mensaje || 'No se pudo cambiar el estado.';
          }
        },
        error: (err) => {
          console.error('Error al cambiar estado del servicio:', err);
          this.errorMsg =
            err.error?.mensaje ||
            'Error al cambiar el estado del servicio. Probá nuevamente.';
        },
        complete: () => {
          this.cambiandoId = null;
        },
      });
  }
}
