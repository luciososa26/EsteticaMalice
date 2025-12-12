import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ni siquiera está logueado, lo mando a login
  if (!authService.estaLogueado()) {
    router.navigate(['/login'], { queryParams: { redirectTo: state.url } });
    return false;
  }

  // Si NO es admin, lo mando al inicio
  if (!authService.isAdmin()) {
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};
