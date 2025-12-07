import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  ServiciosService,
  Servicio,
} from '../../../core/services/servicios.service';

@Component({
  selector: 'app-servicio-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicio-detalle.component.html',
  styleUrls: ['./servicio-detalle.component.scss'],
})
export class ServicioDetalleComponent implements OnInit {
  servicio: Servicio | null = null;
  cargando = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviciosService: ServiciosService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.router.navigate(['/servicios']);
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.router.navigate(['/servicios']);
      return;
    }

    this.cargarServicio(id);
  }

  cargarServicio(id: number): void {
    this.cargando = true;
    this.errorMsg = '';

    this.serviciosService.obtenerServicioPorId(id).subscribe({
      next: (resp) => {
        if (resp.ok && resp.servicio) {
          this.servicio = resp.servicio;
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo cargar el servicio.';
        }
      },
      error: (err) => {
        console.error('Error al obtener servicio por id:', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al cargar el servicio seleccionado.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }

  volverAListado(): void {
    this.router.navigate(['/servicios']);
  }

  irAReservar(): void {
    this.router.navigate(['/turnos']);
  }
}
