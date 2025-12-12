import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Leemos el token guardado en localStorage
    const token = this.authService.obtenerToken();

    let authReq = req;

    // Solo agregamos el header si hay token
    // y si el request va a nuestra API (para no tocar cosas externas)
    if (token && req.url.startsWith(environment.apiUrl)) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Dejamos pasar la request, pero podemos atrapar errores 401
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si el token es inválido/expiró, lo borramos
          this.authService.logout();
          // Opcional: redirigir al login
          // this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
