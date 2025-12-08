import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { TurnosService, Turno } from '../../../../core/services/turnos.service';
import { ServiciosService, Servicio } from '../../../../core/services/servicios.service';
import { ProfesionalesService, Profesional } from '../../../../core/services/profesionales.service';

@Component({
  selector: 'app-admin-turnos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-turnos-form.component.html',
  styleUrls: ['./admin-turnos-form.component.scss'],
})
export class AdminTurnosFormComponent implements OnInit {
  form!: any;

  cargando = false;
  mensajeOk = '';
  errorMsg = '';

  turno!: Turno;
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
      id_servicio: ['', Validators.required],
      id_profesional: ['', Validators.required],
      estado: ['', Validators.required], // pendiente / confirmado / cancelado
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.cargarListas();
    this.cargarTurno(id);
  }

  cargarListas() {
    this.serviciosService.obtenerServicios().subscribe((resp) => {
      if (resp.ok) this.servicios = resp.servicios;
    });

    this.profesionalesService.obtenerProfesionales().subscribe((resp: any) => {
      if (resp.ok) this.profesionales = resp.profesionales;
    });
  }

  cargarTurno(id: number) {
    this.cargando = true;

    this.turnosService.obtenerTurnosAdmin().subscribe({
      next: (resp: any) => {
        const turno = resp.turnos?.find((t: any) => t.id === id);
        if (turno) {
          this.turno = turno;

          this.form.patchValue({
            fecha: turno.fecha,
            hora: turno.hora.slice(0, 5),
            id_servicio: turno.id_servicio,
            id_profesional: turno.id_profesional,
            estado: turno.estado,
          });
        } else {
          this.errorMsg = 'No se pudo cargar el turno';
        }
      },
      error: (err: any) => {
        this.errorMsg = 'Error al cargar turno';
      },
      complete: () => (this.cargando = false),
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.turno.id;

    const datos = {
      ...this.form.value,
      hora: this.form.value.hora + ':00',
      id_servicio: Number(this.form.value.id_servicio),
      id_profesional: Number(this.form.value.id_profesional),
    };

    this.turnosService.actualizarTurno(id, datos).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.mensajeOk = 'Turno actualizado correctamente';
          setTimeout(() => this.router.navigate(['/admin/turnos']), 1200);
        } else {
          this.errorMsg = resp.mensaje || 'Error al actualizar turno';
        }
      },
      error: () => (this.errorMsg = 'No se pudo actualizar'),
    });
  }
}
