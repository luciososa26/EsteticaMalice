import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  cargando = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  private redirigirPostLogin(): void {
    // Si el guard mandó ?redirectTo=/admin/..., respetamos eso
    const redirectTo =
      this.route.snapshot.queryParamMap.get('redirectTo') || '/inicio';
    this.router.navigate([redirectTo]);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    const { email, password } = this.loginForm.value;

    this.authService
      .login({ email: email || '', password: password || '' })
      .subscribe({
        next: (resp: any) => {
          if (resp.ok && resp.token) {
            // 1) Guardamos token
            this.authService.guardarToken(resp.token);

            // 2) Si el backend ya manda el usuario con rol, lo guardamos
            if (resp.usuario) {
              this.authService.guardarUsuario(resp.usuario);
              this.redirigirPostLogin();
              return;
            }

            // 3) Si no vino usuario en el login, pedimos /auth/me
            this.authService.me().subscribe({
              next: (meResp: any) => {
                if (meResp.ok && meResp.usuario) {
                  this.authService.guardarUsuario(meResp.usuario);
                }
                this.redirigirPostLogin();
              },
              error: () => {
                // Si falla /me, igual lo mando al inicio
                this.redirigirPostLogin();
              },
            });
          } else {
            this.errorMsg = resp.mensaje || 'Error desconocido';
          }
        },
        error: (err) => {
          this.errorMsg = err.error?.mensaje || 'Error al iniciar sesión.';
          this.cargando = false;
        },
        complete: () => {
          this.cargando = false;
        },
      });
  }

  campoInvalido(campo: string): boolean {
    const control = this.loginForm.get(campo);
    return !!control && control.invalid && control.touched;
  }
}
