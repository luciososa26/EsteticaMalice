import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // 👈 ojo la ruta

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menuAbierto = false;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  irAInicio() {
    this.menuAbierto = false;
    this.router.navigate(['/']);
  }

  cerrarSesion() {
    this.authService.logout();      // usa tu logout del AuthService
    this.menuAbierto = false;
    this.router.navigate(['/login']);
  }
}
