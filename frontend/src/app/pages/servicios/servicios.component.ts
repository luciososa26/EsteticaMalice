import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ServiciosService,
  Servicio,
} from '../../core/services/servicios.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  cargando = false;
  errorMsg = '';

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios() {
    this.cargando = true;
    this.errorMsg = '';

    this.serviciosService.obtenerServicios().subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.servicios = resp.servicios;
        } else {
          this.errorMsg = resp.mensaje || 'No se pudieron cargar los servicios.';
        }
      },
      error: (err) => {
        console.error('Error al obtener servicios:', err);
        this.errorMsg =
          err.error?.mensaje || 'Error de conexión al cargar los servicios.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }
}
