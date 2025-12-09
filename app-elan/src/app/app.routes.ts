import { RouterModule,Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientesComponent } from './clientes/clientes';
import { ExposicionesComponent } from './exposiciones/exposiciones';
import { HomeComponent } from './home/home';
import { InicioComponent } from './inicio/inicio';
import { ObrasComponent } from './obras/obras';
import { VentasComponent } from './ventas/ventas';
import { ArtistasComponent } from './artistas/artistas';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'obras', component: ObrasComponent, canActivate: [authGuard] },
  {
    path: 'exposiciones',
    loadComponent: () => import('./exposiciones/exposiciones')
      .then(m => m.ExposicionesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'artistas',
    loadComponent: () => import('./artistas/artistas')
      .then(m => m.ArtistasComponent),
    canActivate: [authGuard]
  },
  {
    path: 'clientes',
    loadComponent: () => import('./clientes/clientes')
      .then(m => m.ClientesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ventas',
    loadComponent: () => import('./ventas/ventas')
      .then(m => m.VentasComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/inicio' }
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule{}
