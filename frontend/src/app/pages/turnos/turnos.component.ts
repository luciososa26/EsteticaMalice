import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  ServiciosService,
  Servicio,
} from '../../core/services/servicios.service';
import {
  ProfesionalesService,
  Profesional,
} from '../../core/services/profesionales.service';
import { TurnosService, Turno } from '../../core/services/turnos.service';
import { AuthService } from '../../core/services/auth.service';

interface DiaDisponible {
  fecha: Date;
  etiquetaDia: string; // Mié, Jue, Vie...
  etiquetaNum: string; // 03, 04, 05...
}

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss'],
})
export class TurnosComponent implements OnInit {
  turnoForm!: FormGroup;

  servicios: Servicio[] = [];
  profesionales: Profesional[] = [];
  turnosUsuario: Turno[] = [];

  turnosOcupadosDia: Turno[] = [];

  cargandoDatos = false;
  cargandoTurnosUsuario = false;
  creandoTurno = false;
  cancelandoId: number | null = null;

  mensajeOk = '';
  errorMsg = '';

  idUsuario: number | null = null;

  // Selector tipo calendario + horarios
  diasDisponibles: DiaDisponible[] = [];
  diaSeleccionado: DiaDisponible | null = null;

  horariosManana: string[] = [];
  horariosTarde: string[] = [];
  horaSeleccionada: string | null = null;

  pasoActual = 1; // 1 = fecha/hora, 2 = servicio/profesional

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService,
    private profesionalesService: ProfesionalesService,
    private turnosService: TurnosService,
    private authService: AuthService
  ) {
    this.turnoForm = this.fb.group({
      id_servicio: [null, [Validators.required]],
      id_profesional: [null, [Validators.required]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.generarDiasDisponibles();
    this.cargarUsuarioYDatos();
  }

  // ===========================
  // DÍAS Y HORARIOS (UI)
  // ===========================

  generarDiasDisponibles() {
    const hoy = new Date();
    const dias: DiaDisponible[] = [];
    const formatoDia = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = 0; i < 14; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);

      dias.push({
        fecha: d,
        etiquetaDia: formatoDia[d.getDay()],
        etiquetaNum: d.getDate().toString().padStart(2, '0'),
      });
    }

    this.diasDisponibles = dias;
  }

  // Genera los horarios (cada 1h) según el día elegido
  private actualizarHorariosParaDia(dia: DiaDisponible) {
    const dayOfWeek = dia.fecha.getDay(); // 0 = Dom, 1 = Lun, ..., 6 = Sáb

    // Domingo cerrado
    if (dayOfWeek === 0) {
      this.horariosManana = [];
      this.horariosTarde = [];
      this.errorMsg = 'La estética permanece cerrada los domingos.';
      return;
    }

    this.errorMsg = '';

    // Horario base: Lun–Vie 8–19
    let apertura = 8;
    let cierre = 19; // último turno 18:00

    // Sábado: 8–13 → 8,9,10,11,12
    if (dayOfWeek === 6) {
      cierre = 13;
    }

    const mañana: string[] = [];
    const tarde: string[] = [];

    for (let h = apertura; h < cierre; h++) {
      const hh = h.toString().padStart(2, '0');
      const timeStr = `${hh}:00`; // "08:00", "09:00", etc.

      if (h < 13) {
        mañana.push(timeStr); // 8,9,10,11,12
      } else {
        tarde.push(timeStr);  // 13,14,15,16,17,18
      }
    }

    this.horariosManana = mañana;
    this.horariosTarde = tarde;
  }

  seleccionarDia(dia: DiaDisponible) {
    this.diaSeleccionado = dia;
    this.horaSeleccionada = null; // reseteamos hora

    const año = dia.fecha.getFullYear();
    const mes = (dia.fecha.getMonth() + 1).toString().padStart(2, '0');
    const diaNum = dia.fecha.getDate().toString().padStart(2, '0');

    const fechaStr = `${año}-${mes}-${diaNum}`;
    this.turnoForm.patchValue({ fecha: fechaStr });

    // Generamos horarios base (según si es Lun–Vie o Sáb)
    this.actualizarHorariosParaDia(dia);

    // 👇 Pedimos al backend los turnos ocupados de ese día (cualquier cliente)
    this.turnosOcupadosDia = [];
    this.turnosService.obtenerTurnosPorFecha(fechaStr).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.turnosOcupadosDia = resp.turnos;
        } else {
          this.turnosOcupadosDia = [];
        }
      },
      error: (err) => {
        console.error('Error al obtener turnos ocupados del día:', err);
        this.turnosOcupadosDia = [];
      },
    });
  }


  seleccionarHora(hora: string) {
    this.horaSeleccionada = hora;
    this.turnoForm.patchValue({ hora }); // ej: "08:00"
  }

  irAlPaso2() {
    if (!this.turnoForm.value.fecha || !this.turnoForm.value.hora) {
      this.errorMsg = 'Elegí una fecha y un horario antes de continuar.';
      this.turnoForm.markAllAsTouched();
      return;
    }
    this.errorMsg = '';
    this.pasoActual = 2;
  }

  volverAlPaso1() {
    this.pasoActual = 1;
  }

  // ===========================
  // CARGA DE USUARIO + DATOS
  // ===========================

  cargarUsuarioYDatos() {
    this.cargandoDatos = true;
    this.errorMsg = '';
    this.mensajeOk = '';

    if (!this.authService.estaLogueado()) {
      this.errorMsg = 'Tenés que iniciar sesión para sacar un turno.';
      this.cargandoDatos = false;
      return;
    }

    this.authService.me().subscribe({
      next: (resp) => {
        if (resp.ok && resp.usuario) {
          this.idUsuario = resp.usuario.id;

          this.cargarServicios();
          this.cargarProfesionales();
          this.cargarTurnosDelUsuario();
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo obtener el usuario.';
          this.idUsuario = null;
        }
      },
      error: (err) => {
        console.error('Error al obtener usuario en Turnos:', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al obtener los datos del usuario.';
        this.idUsuario = null;
      },
      complete: () => {
        this.cargandoDatos = false;
      },
    });
  }

  cargarServicios() {
    this.serviciosService.obtenerServicios().subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.servicios = resp.servicios;
        }
      },
      error: (err) => {
        console.error('Error al obtener servicios en Turnos:', err);
      },
    });
  }

  cargarProfesionales() {
    this.profesionalesService.obtenerProfesionales().subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.profesionales = resp.profesionales;
        }
      },
      error: (err) => {
        console.error('Error al obtener profesionales:', err);
      },
    });
  }

  cargarTurnosDelUsuario() {
    if (!this.idUsuario) return;

    this.cargandoTurnosUsuario = true;
    this.turnosService.obtenerTurnosUsuario(this.idUsuario).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.turnosUsuario = resp.turnos;
        } else {
          this.turnosUsuario = [];
        }
      },
      error: (err) => {
        console.error('Error al obtener turnos del usuario:', err);
      },
      complete: () => {
        this.cargandoTurnosUsuario = false;
      },
    });
  }

  // ===========================
  // CREAR TURNO
  // ===========================

  onSubmit() {
    this.mensajeOk = '';
    this.errorMsg = '';

    if (this.turnoForm.invalid || !this.idUsuario) {
      this.turnoForm.markAllAsTouched();
      if (!this.idUsuario) {
        this.errorMsg = 'Tenés que iniciar sesión para sacar un turno.';
      }
      return;
    }

    const { id_servicio, id_profesional, fecha, hora } = this.turnoForm.value;

    const horaConSegundos =
      hora && typeof hora === 'string' && hora.length === 5
        ? `${hora}:00`
        : (hora as string);

    this.creandoTurno = true;

    this.turnosService
      .crearTurno({
        id_usuario: this.idUsuario!,
        id_servicio: Number(id_servicio),
        id_profesional: Number(id_profesional),
        fecha: fecha as string,
        hora: horaConSegundos,
      })
      .subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.mensajeOk = resp.mensaje || 'Turno creado correctamente.';
            this.turnoForm.reset();
            this.diaSeleccionado = null;
            this.horaSeleccionada = null;
            this.pasoActual = 1;
            this.cargarTurnosDelUsuario();
          } else {
            this.errorMsg = resp.mensaje || 'No se pudo crear el turno.';
          }
        },
        error: (err) => {
          console.error('Error al crear turno:', err);
          this.errorMsg =
            err.error?.mensaje || 'Error al crear el turno. Probá nuevamente.';
        },
        complete: () => {
          this.creandoTurno = false;
        },
      });
  }

  cancelarTurno(turno: Turno) {
    this.mensajeOk = '';
    this.errorMsg = '';

    if (turno.estado !== 'pendiente') {
      return; // por si acaso
    }

    const confirmacion = window.confirm(
      `¿Seguro que querés cancelar el turno de "${turno.servicio}" con ${turno.profesional} el ${turno.fecha} a las ${turno.hora}?`
    );

    if (!confirmacion) {
      return;
    }

    this.cancelandoId = turno.id;

    this.turnosService.cancelarTurno(turno.id).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.mensajeOk = resp.mensaje || 'Turno cancelado correctamente.';
          this.cargarTurnosDelUsuario();
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo cancelar el turno.';
        }
      },
      error: (err) => {
        console.error('Error al cancelar turno:', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al cancelar el turno. Probá nuevamente.';
      },
      complete: () => {
        this.cancelandoId = null;
      },
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.turnoForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  esHorarioOcupado(hora: string): boolean {
    const fechaSeleccionada: string | undefined = this.turnoForm.value.fecha;

    if (!fechaSeleccionada) {
      return false;
    }

    // Miramos los turnos de ese día (cualquier cliente)
    return this.turnosOcupadosDia.some((t) => {
      const fechaTurno = String(t.fecha).slice(0, 10); // "YYYY-MM-DD"
      const horaTurno = String(t.hora).slice(0, 5);    // "HH:MM"

      const mismaFecha = fechaTurno === fechaSeleccionada;
      const mismaHora = horaTurno === hora;
      const estadoValido =
        t.estado === 'pendiente' || t.estado === 'confirmado';

      return mismaFecha && mismaHora && estadoValido;
    });
  }



  // 🔽🔽🔽 ACA VAN LOS GETTERS 🔽🔽🔽

  // Horarios filtrados (solo disponibles)
  get horariosMananaDisponibles(): string[] {
    return this.horariosManana.filter((h) => !this.esHorarioOcupado(h));
  }

  get horariosTardeDisponibles(): string[] {
    return this.horariosTarde.filter((h) => !this.esHorarioOcupado(h));
  }

  // Flag para saber si NO queda ningún horario disponible
  get noHayHorariosDisponibles(): boolean {
    return (
      !!this.diaSeleccionado &&
      this.horariosMananaDisponibles.length === 0 &&
      this.horariosTardeDisponibles.length === 0
    );
  }

} // 👈 este es el cierre final de la clase


