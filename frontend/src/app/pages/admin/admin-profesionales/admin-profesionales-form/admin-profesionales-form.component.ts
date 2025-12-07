import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfesionalesService } from '../../../../core/services/profesionales.service';

interface ProfesionalFormData {
  nombre_apellido: string;
  especialidad?: string;
  telefono?: string;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-admin-profesional-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-profesionales-form.component.html', // ojo con el nombre del archivo
  styleUrls: ['./admin-profesionales-form.component.scss'],
})
export class AdminProfesionalFormComponent implements OnInit {
  form!: FormGroup;
  editId: number | null = null;
  titulo = 'Nuevo profesional';
  cargando = false;
  mensajeOk = '';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profesionalesService: ProfesionalesService
  ) {}

  ngOnInit(): void {
    // ⬇️ Ahora sí inicializamos el form acá, así no da el error de "fb usado antes de inicializar"
    this.form = this.fb.group({
      nombre_apellido: ['', Validators.required],
      especialidad: [''],
      telefono: [''],
      estado: ['activo', Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.titulo = 'Editar profesional';
      this.cargarProfesional(this.editId);
    }
  }

  cargarProfesional(id: number): void {
    this.cargando = true;
    this.profesionalesService.obtenerProfesionalPorId(id).subscribe({
      next: (resp: any) => {
        if (resp.ok && resp.profesional) {
          this.form.patchValue({
            nombre_apellido: resp.profesional.nombre_apellido || '',
            especialidad: resp.profesional.especialidad || '',
            telefono: resp.profesional.telefono || '',
            estado: resp.profesional.estado || 'activo',
          });
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo cargar el profesional.';
        }
      },
      error: (err) => {
        console.error('Error al cargar profesional:', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al cargar el profesional.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }

  guardar(): void {
    this.mensajeOk = '';
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    // Forzamos el tipo para que no se queje TS
    const datos: ProfesionalFormData = {
      nombre_apellido: raw.nombre_apellido as string,
      especialidad: raw.especialidad || '',
      telefono: raw.telefono || '',
      estado: (raw.estado as 'activo' | 'inactivo') || 'activo',
    };

    this.cargando = true;

    if (this.editId) {
      // MODO EDICIÓN
      this.profesionalesService
        .actualizarProfesional(this.editId, datos)
        .subscribe({
          next: (resp: any) => {
            if (resp.ok) {
              this.mensajeOk =
                resp.mensaje || 'Profesional actualizado correctamente.';
              this.router.navigate(['/admin/profesionales']);
            } else {
              this.errorMsg =
                resp.mensaje || 'No se pudo actualizar el profesional.';
            }
          },
          error: (err) => {
            console.error('Error al actualizar profesional:', err);
            this.errorMsg =
              err.error?.mensaje ||
              'Error al actualizar el profesional. Probá nuevamente.';
          },
          complete: () => {
            this.cargando = false;
          },
        });
    } else {
      // MODO ALTA
      this.profesionalesService.crearProfesional(datos).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this.mensajeOk =
              resp.mensaje || 'Profesional creado correctamente.';
            this.router.navigate(['/admin/profesionales']);
          } else {
            this.errorMsg =
              resp.mensaje || 'No se pudo crear el profesional.';
          }
        },
        error: (err) => {
          console.error('Error al crear profesional:', err);
          this.errorMsg =
            err.error?.mensaje ||
            'Error al crear el profesional. Probá nuevamente.';
        },
        complete: () => {
          this.cargando = false;
        },
      });
    }
  }
}
