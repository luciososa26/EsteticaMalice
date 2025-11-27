import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  usuario: any = null;
  cargando = false;
  errorMsg = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Si no hay token, no molestamos al backend
    if (!this.authService.estaLogueado()) {
      return;
    }

    this.cargando = true;
    this.authService.me().subscribe({
      next: (resp) => {
        if (resp.ok && resp.usuario) {
          this.usuario = resp.usuario;
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo cargar el usuario.';
        }
      },
      error: (err) => {
        console.error('Error al pedir /me:', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al cargar los datos del usuario.';
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }
}
