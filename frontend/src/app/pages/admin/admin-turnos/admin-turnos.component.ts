import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TurnosService, Turno } from '../../../core/services/turnos.service';

@Component({
  selector: 'app-admin-turnos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-turnos.component.html',
  styleUrls: ['./admin-turnos.component.scss'],
})
export class AdminTurnosComponent implements OnInit {
  turnos: Turno[] = [];
  cargando = false;
  mensajeOk = '';
  errorMsg = '';
  accionandoId: number | null = null;
  cancelandoId: number | null = null;  

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.mensajeOk = '';

    this.turnosService.obtenerTurnosAdmin().subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.turnos = resp.turnos;
        } else {
          this.errorMsg = resp.mensaje || 'No se pudieron cargar los turnos.';
        }
      },
      error: (err) => {
        console.error('Error al obtener turnos (admin):', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al obtener la lista de turnos.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }

  // ======== EDITAR TURNO ========
  editarTurno(turno: Turno): void {
    this.mensajeOk = '';
    this.errorMsg = '';

    // Solo permitimos editar pendientes (si querés, sacás esta condición)
    if (turno.estado !== 'pendiente') {
      window.alert('Solo se pueden editar turnos en estado pendiente.');
      return;
    }

    const fechaActual = turno.fecha;                  // "2025-12-01"
    const horaActual = (turno.hora || '').slice(0,5); // "11:00" de "11:00:00"

    const nuevaFecha = window.prompt(
      'Nueva fecha (YYYY-MM-DD):',
      fechaActual
    );
    if (!nuevaFecha) {
      return;
    }

    const nuevaHora = window.prompt(
      'Nueva hora (HH:mm):',
      horaActual
    );
    if (!nuevaHora) {
      return;
    }

    // Armamos hora con segundos
    const horaConSegundos =
      nuevaHora.length === 5 ? `${nuevaHora}:00` : nuevaHora;

    this.accionandoId = turno.id;

    this.turnosService
      .actualizarTurno(turno.id, {
        fecha: nuevaFecha,
        hora: horaConSegundos,
      })
      .subscribe({
        next: (resp) => {
          if (resp.ok && resp.turno) {
            this.mensajeOk = resp.mensaje || 'Turno actualizado correctamente.';

            // Actualizamos en el array local sin recargar todo
            this.turnos = this.turnos.map((t) =>
              t.id === turno.id ? { ...t, ...resp.turno } : t
            );
          } else {
            this.errorMsg =
              resp.mensaje || 'No se pudo actualizar el turno.';
          }
        },
        error: (err) => {
          console.error('Error al actualizar turno:', err);
          this.errorMsg =
            err.error?.mensaje ||
            'Error al actualizar el turno. Probá nuevamente.';
        },
        complete: () => {
          this.accionandoId = null;
        },
      });
  }

  cancelarTurno(turno: Turno): void {
    this.mensajeOk = '';
    this.errorMsg = '';

    if (turno.estado === 'cancelado') {
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que querés cancelar el turno de "${turno.servicio}" con ${turno.profesional} el ${turno.fecha} a las ${turno.hora}?`
    );

    if (!confirmar) return;

    this.cancelandoId = turno.id;

    this.turnosService.cancelarTurno(turno.id).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.mensajeOk =
            resp.mensaje || 'Turno cancelado correctamente.';

          // Actualizar en la tabla
          this.turnos = this.turnos.map((t) =>
            t.id === turno.id ? { ...t, estado: 'cancelado' } : t
          );
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo cancelar el turno.';
        }
      },
      error: (err) => {
        console.error('Error al cancelar turno (admin):', err);
        this.errorMsg =
          err.error?.mensaje ||
          'Error al cancelar el turno. Probá nuevamente.';
      },
      complete: () => {
        this.cancelandoId = null;
      },
    });
  }

  getBadgeClass(estado: Turno['estado']): string {
    switch (estado) {
      case 'pendiente':
        return 'badge badge--pendiente';
      case 'confirmado':
        return 'badge badge--confirmado';
      case 'cancelado':
        return 'badge badge--cancelado';
      default:
        return 'badge';
    }
  }
}
