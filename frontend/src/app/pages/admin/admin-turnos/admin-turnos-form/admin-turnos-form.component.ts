import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import {
  TurnosService,
  Turno,
  TurnosResponse,
} from '../../../../core/services/turnos.service';
import {
  ServiciosService,
  Servicio,
  ServiciosResponse,
} from '../../../../core/services/servicios.service';
import {
  ProfesionalesService,
  Profesional,
} from '../../../../core/services/profesionales.service';

@Component({
  selector: 'app-admin-turnos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-turnos-form.component.html',
  styleUrls: ['./admin-turnos-form.component.scss'],
})
export class AdminTurnosFormComponent implements OnInit {
  form: FormGroup;

  cargando = false;
  mensajeOk = '';
  errorMsg = '';

  turno: Turno | null = null;
  servicios: Servicio[] = [];
  profesionales: Profesional[] = [];

  constructor(
    private fb: FormBuilder,
    private turnosService: TurnosService,
    private serviciosService: ServiciosService,
    private profesionalesService: ProfesionalesService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      id_servicio: [null, Validators.required],
      id_profesional: [null, Validators.required],
      estado: ['pendiente', Validators.required], // pendiente / confirmado / cancelado
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      this.errorMsg = 'ID de turno inválido.';
      return;
    }

    this.cargarListas();
    this.cargarTurno(id);
  }

  // =========================
  // Cargar combos
  // =========================
  cargarListas(): void {
    this.serviciosService.obtenerServicios().subscribe({
      next: (resp: ServiciosResponse) => {
        if (resp.ok && resp.servicios) {
          this.servicios = resp.servicios;
        }
      },
      error: () => {
        // si querés, podrías setear errorMsg acá también
      },
    });

    this.profesionalesService.obtenerProfesionales().subscribe({
      next: (resp: { ok: boolean; profesionales: Profesional[] }) => {
        if (resp.ok && resp.profesionales) {
          this.profesionales = resp.profesionales;
        }
      },
      error: () => {},
    });
  }

  // Normaliza fecha para <input type="date">
  private normalizarFecha(fecha: string): string {
    // Si viene como "2025-11-29T03:00:00.000Z"
    if (fecha.includes('T')) {
      return fecha.split('T')[0];
    }
    return fecha;
  }

  // =========================
  // Cargar turno a editar
  // =========================
  cargarTurno(id: number): void {
    this.cargando = true;
    this.errorMsg = '';
    this.mensajeOk = '';

    this.turnosService.obtenerTurnosAdmin().subscribe({
      next: (resp: TurnosResponse) => {
        if (resp.ok && resp.turnos?.length) {
          const turno = resp.turnos.find((t: Turno) => t.id === id);

          if (!turno) {
            this.errorMsg = 'No se encontró el turno solicitado.';
            return;
          }

          this.turno = turno;

          // OJO: necesitás que el backend envíe id_servicio e id_profesional
          const anyTurno = turno as any;

          this.form.patchValue({
            fecha: this.normalizarFecha(turno.fecha),
            hora: (turno.hora || '').slice(0, 5),
            id_servicio: anyTurno.id_servicio ?? null,
            id_profesional: anyTurno.id_profesional ?? null,
            estado: turno.estado,
          });
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo cargar el turno.';
        }
      },
      error: () => {
        this.errorMsg = 'Error al cargar turno.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }

  // =========================
  // Guardar cambios
  // =========================
  guardar(): void {
    this.mensajeOk = '';
    this.errorMsg = '';

    if (!this.turno) {
      this.errorMsg = 'No hay turno cargado para editar.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fecha, hora, id_servicio, id_profesional, estado } =
      this.form.value;

    const horaNormalizada: string =
      typeof hora === 'string' && hora.length === 5 ? `${hora}:00` : hora;

    const datos = {
      fecha: fecha as string,
      hora: horaNormalizada,
      id_servicio: Number(id_servicio),
      id_profesional: Number(id_profesional),
      estado: estado as Turno['estado'],
    };

    this.cargando = true;

    this.turnosService.actualizarTurno(this.turno.id, datos).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.mensajeOk = resp.mensaje || 'Turno actualizado correctamente.';
          setTimeout(() => this.router.navigate(['/admin/turnos']), 1200);
        } else {
          this.errorMsg = resp.mensaje || 'Error al actualizar turno.';
        }
      },
      error: () => {
        this.errorMsg = 'No se pudo actualizar el turno.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }
}
