import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { InicioComponent } from './pages/inicio/inicio.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { ServicioDetalleComponent } from './pages/servicios/servicio-detalle/servicio-detalle.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { MiCuentaComponent } from './pages/mi-cuenta/mi-cuenta.component';

import { PanelAdminComponent } from './pages/admin/panel-admin/panel-admin.component';
import { AdminServiciosComponent } from './pages/admin/admin-servicios/admin-servicios.component';
import { AdminProfesionalesComponent } from './pages/admin/admin-profesionales/admin-profesionales.component';
import { AdminProfesionalFormComponent } from './pages/admin/admin-profesionales/admin-profesionales-form/admin-profesionales-form.component';
import { AdminTurnosComponent } from './pages/admin/admin-turnos/admin-turnos.component';
import { AdminTurnosFormComponent } from './pages/admin/admin-turnos/admin-turnos-form/admin-turnos-form.component';
import { AdminConsultasComponent } from './pages/admin/admin-consultas/admin-consultas.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // ============================
  //        RUTAS PÚBLICAS
  // ============================
  { path: 'inicio', component: InicioComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'servicios/:id', component: ServicioDetalleComponent },
  { path: 'contacto', component: ContactoComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ============================
  //     RUTAS PROTEGIDAS (CLIENTE)
  // ============================
  {
    path: 'turnos',
    component: TurnosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'mi-cuenta',
    component: MiCuentaComponent,
    canActivate: [authGuard],
  },

  // ============================
  //       RUTAS ADMIN (PROTEGIDAS)
  // ============================
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      // Dashboard principal
      { path: '', component: PanelAdminComponent },

      // Servicios
      { path: 'servicios', component: AdminServiciosComponent },

      // Profesionales
      { path: 'profesionales', component: AdminProfesionalesComponent },
      { path: 'profesionales/nuevo', component: AdminProfesionalFormComponent },
      {
        path: 'profesionales/editar/:id',
        component: AdminProfesionalFormComponent,
      },

      // Turnos
      { path: 'turnos', component: AdminTurnosComponent },
      {
        path: 'turnos/editar/:id',
        component: AdminTurnosFormComponent,
      },

      // Consultas
      { path: 'consultas', component: AdminConsultasComponent },
    ],
  },

  // ============================
  //  REDIRECCIONES / 404
  // ============================
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];
