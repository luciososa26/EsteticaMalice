import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  ServiciosService,
  Servicio,
} from '../../core/services/servicios.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'], // aunque esté vacío por ahora
})
export class InicioComponent implements OnInit {
  serviciosDestacados: Servicio[] = [];
  cargandoServicios = false;
  errorServicios = '';

  constructor(
    private serviciosService: ServiciosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarServiciosDestacados();
  }

  private cargarServiciosDestacados(): void {
    this.cargandoServicios = true;
    this.errorServicios = '';

    this.serviciosService.obtenerServicios().subscribe({
      next: (resp) => {
        if (resp.ok && resp.servicios?.length) {
          // Tomamos los primeros 3 como "destacados"
          this.serviciosDestacados = resp.servicios.slice(0, 3);
        } else {
          this.serviciosDestacados = [];
        }
      },
      error: (err) => {
        console.error('Error al obtener servicios destacados:', err);
        this.errorServicios =
          err.error?.mensaje || 'No se pudieron cargar los servicios.';
      },
      complete: () => {
        this.cargandoServicios = false;
      },
    });
  }

  irAReservarTurno(): void {
    this.router.navigate(['/turnos']);
  }

  irAServicios(): void {
    this.router.navigate(['/servicios']);
  }
}
