import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // ajustá la ruta si hace falta

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaLogueado()) {
    return true;
  }

  // si no está logueado, lo mando a login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};
