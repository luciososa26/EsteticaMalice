import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { InicioComponent } from './pages/inicio/inicio.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { MiCuentaComponent } from './pages/mi-cuenta/mi-cuenta.component';

export const routes: Routes = [

  // ============================
  //        RUTAS PÚBLICAS
  // ============================
  { path: 'inicio', component: InicioComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'contacto', component: ContactoComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ============================
  //     RUTAS PROTEGIDAS
  // ============================
  { 
    path: 'turnos',
    component: TurnosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'mi-cuenta',
    component: MiCuentaComponent,
    canActivate: [authGuard],
  },

  // ============================
  //  REDIRECCIONES / 404
  // ============================
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];
