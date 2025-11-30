import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TurnosService, Turno } from '../../core/services/turnos.service';

@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.scss'],
})
export class MiCuentaComponent implements OnInit {
  usuario: any = null;
  idUsuario: number | null = null;

  turnos: Turno[] = [];
  cargandoUsuario = false;
  cargandoTurnos = false;
  cancelandoId: number | null = null;

  mensajeOk = '';
  errorMsg = '';

  constructor(
    public authService: AuthService,
    private turnosService: TurnosService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarioYTurnos();
  }

  private cargarUsuarioYTurnos(): void {
    this.cargandoUsuario = true;
    this.errorMsg = '';
    this.mensajeOk = '';

    this.authService.me().subscribe({
      next: (resp) => {
        if (resp.ok && resp.usuario) {
          this.usuario = resp.usuario;
          this.idUsuario = resp.usuario.id;
          this.cargarTurnos();
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo obtener el usuario.';
          this.usuario = null;
          this.idUsuario = null;
        }
      },
      error: (err) => {
        console.error('Error al obtener usuario en MiCuenta:', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al obtener los datos del usuario.';
        this.usuario = null;
        this.idUsuario = null;
      },
      complete: () => {
        this.cargandoUsuario = false;
      },
    });
  }

  private cargarTurnos(): void {
    if (!this.idUsuario) return;

    this.cargandoTurnos = true;
    this.turnosService.obtenerTurnosUsuario(this.idUsuario).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.turnos = resp.turnos;
        } else {
          this.turnos = [];
        }
      },
      error: (err) => {
        console.error('Error al obtener turnos en MiCuenta:', err);
        this.errorMsg =
          this.errorMsg || 'Error al obtener tus turnos. Probá nuevamente.';
      },
      complete: () => {
        this.cargandoTurnos = false;
      },
    });
  }

  cancelarTurno(turno: Turno): void {
    this.mensajeOk = '';
    this.errorMsg = '';

    if (turno.estado !== 'pendiente') {
      return;
    }

    const confirmacion = window.confirm(
      `¿Seguro que querés cancelar el turno de "${turno.servicio}" con ${turno.profesional} el ${turno.fecha} a las ${turno.hora}?`
    );

    if (!confirmacion) return;

    this.cancelandoId = turno.id;

    this.turnosService.cancelarTurno(turno.id).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.mensajeOk = resp.mensaje || 'Turno cancelado correctamente.';
          this.cargarTurnos();
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo cancelar el turno.';
        }
      },
      error: (err) => {
        console.error('Error al cancelar turno en MiCuenta:', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al cancelar el turno. Probá nuevamente.';
      },
      complete: () => {
        this.cancelandoId = null;
      },
    });
  }
}
