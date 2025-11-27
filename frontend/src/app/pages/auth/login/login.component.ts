import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  
  // Declaramos el form, pero NO lo inicializamos aquí
  loginForm!: FormGroup;

  cargando = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // 👇 AHORA sí: creamos el formulario dentro del constructor
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
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
        next: (resp) => {
          if (resp.ok && resp.token) {
            this.authService.guardarToken(resp.token);
            this.router.navigate(['/inicio']);
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
