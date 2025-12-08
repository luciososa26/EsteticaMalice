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

  cancelarTurno(turno: Turno): void {
    this.mensajeOk = '';
    this.errorMsg = '';

    if (turno.estado === 'cancelado') return;

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
