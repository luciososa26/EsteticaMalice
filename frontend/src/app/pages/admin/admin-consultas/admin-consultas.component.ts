import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConsultasService,
  Consulta,
} from '../../../core/services/consultas.service';

@Component({
  selector: 'app-admin-consultas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-consultas.component.html',
  styleUrls: ['./admin-consultas.component.scss'],
})
export class AdminConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  cargando = false;
  mensajeOk = '';
  errorMsg = '';
  accionandoId: number | null = null;

  constructor(private consultasService: ConsultasService) {}

  ngOnInit(): void {
    this.cargarConsultas();
  }

  cargarConsultas(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.mensajeOk = '';

    this.consultasService.obtenerConsultas().subscribe({
      next: (resp) => {
        if (resp.ok && resp.consultas) {
          this.consultas = resp.consultas;
        } else {
          this.errorMsg =
            resp.mensaje || 'No se pudieron cargar las consultas.';
        }
      },
      error: (err) => {
        console.error('Error al obtener consultas (admin):', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al obtener la lista de consultas.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }

  toggleEstado(consulta: Consulta): void {
    this.mensajeOk = '';
    this.errorMsg = '';

    const nuevoEstado: 'pendiente' | 'respondida' =
      consulta.estado === 'pendiente' ? 'respondida' : 'pendiente';

    const msg =
      nuevoEstado === 'respondida'
        ? `¿Marcar la consulta de "${consulta.nombre}" como respondida?`
        : `¿Volver a marcar la consulta de "${consulta.nombre}" como pendiente?`;

    if (!window.confirm(msg)) return;

    this.accionandoId = consulta.id;

    this.consultasService.cambiarEstadoConsulta(consulta.id, nuevoEstado).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.mensajeOk =
            resp.mensaje || 'Estado de la consulta actualizado correctamente.';

          // Actualizar en el array local
          this.consultas = this.consultas.map((c) =>
            c.id === consulta.id ? { ...c, estado: nuevoEstado } : c
          );
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo actualizar el estado.';
        }
      },
      error: (err) => {
        console.error('Error al cambiar estado de consulta:', err);
        this.errorMsg =
          err.error?.mensaje ||
          'Error al cambiar el estado de la consulta. Probá nuevamente.';
      },
      complete: () => {
        this.accionandoId = null;
      },
    });
  }

  getBadgeClass(estado: Consulta['estado']): string {
    switch (estado) {
      case 'pendiente':
        return 'badge badge--pendiente';
      case 'respondida':
        return 'badge badge--respondida';
      default:
        return 'badge';
    }
  }
}
