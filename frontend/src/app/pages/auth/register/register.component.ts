import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;

  cargando = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Creamos el formulario dentro del constructor
    this.registerForm = this.fb.group({
      nombre_apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
    });
  }

  onSubmit() {
    // Validaciones simples de form
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre_apellido, email, telefono, password, password2 } =
      this.registerForm.value;

    // Validar que las contraseñas coincidan
    if (password !== password2) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    this.authService
      .register({
        nombre_apellido: nombre_apellido || '',
        email: email || '',
        password: password || '',
        telefono: telefono || '',
      })
      .subscribe({
        next: (resp) => {
          if (resp.ok && resp.token) {
            // Guardamos token
            this.authService.guardarToken(resp.token);

            // Podríamos mostrar un mensaje lindo, pero por ahora redirigimos
            this.router.navigate(['/inicio']);
          } else {
            this.errorMsg = resp.mensaje || 'No se pudo registrar.';
          }
        },
        error: (err) => {
          console.error('Error HTTP en register:', err);
          this.errorMsg =
            err.error?.mensaje || 'Hubo un error al registrarte.';
          this.cargando = false;
        },
        complete: () => {
          this.cargando = false;
        },
      });
  }

  campoInvalido(campo: string): boolean {
    const control = this.registerForm.get(campo);
    return !!control && control.invalid && control.touched;
  }
}
