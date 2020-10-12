import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@fussball/shared';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    loadChildren: () => import('@fussball/landing').then(m => m.LandingModule),
  },
  {
    path: 'players',
    loadChildren: () => import('@fussball/players').then(m => m.PlayersModule),
  },
  {
    path: 'player',
    loadChildren: () => import('@fussball/player').then(m => m.PlayerModule),
  },
  {
    path: 'info',
    loadChildren: () => import('@fussball/info').then(m => m.InfoModule),
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
