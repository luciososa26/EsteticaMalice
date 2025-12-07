import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import {
  ProfesionalesService,
  Profesional,
} from '../../../core/services/profesionales.service';

@Component({
  selector: 'app-admin-profesionales',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-profesionales.component.html',
  styleUrls: ['./admin-profesionales.component.scss'],
})
export class AdminProfesionalesComponent implements OnInit {
  profesionales: Profesional[] = [];
  cargando = false;
  errorMsg = '';
  mensajeOk = '';

  constructor(
    private profesionalesService: ProfesionalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProfesionales();
  }

  cargarProfesionales(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.mensajeOk = '';

    this.profesionalesService.obtenerProfesionales().subscribe({
      next: (resp: any) => {
        if (resp.ok && resp.profesionales) {
          this.profesionales = resp.profesionales;
        } else {
          this.errorMsg =
            resp.mensaje || 'No se pudo obtener la lista de profesionales.';
        }
      },
      error: (err) => {
        console.error('Error al obtener profesionales (admin):', err);
        this.errorMsg =
          err.error?.mensaje ||
          'Error al obtener la lista de profesionales.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }

  irANuevo(): void {
    this.router.navigate(['/admin/profesionales/nuevo']);
  }

  irAEditar(profesional: Profesional): void {
    this.router.navigate(['/admin/profesionales/editar', profesional.id]);
  }
}
