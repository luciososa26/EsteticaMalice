import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ConsultasService,
  CrearConsultaBody,
} from '../../core/services/consultas.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
})
export class ContactoComponent {
  contactoForm: FormGroup;
  enviando = false;
  mensajeOk = '';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private consultasService: ConsultasService
  ) {
    this.contactoForm = this.fb.group({
      nombre_apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.contactoForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  onSubmit() {
    this.mensajeOk = '';
    this.errorMsg = '';

    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      this.errorMsg = 'Revisá los campos marcados en rojo.';
      return;
    }

    const body: CrearConsultaBody = this.contactoForm.value;
    this.enviando = true;

    this.consultasService.crearConsulta(body).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.mensajeOk = resp.mensaje;
          this.contactoForm.reset();
        } else {
          this.errorMsg = resp.mensaje || 'No se pudo enviar la consulta.';
        }
      },
      error: (err) => {
        console.error('Error al enviar consulta:', err);
        this.errorMsg =
          err.error?.mensaje || 'Error al enviar la consulta. Probá nuevamente.';
      },
      complete: () => {
        this.enviando = false;
      },
    });
  }
}
