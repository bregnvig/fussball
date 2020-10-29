import { RouterModule, Routes } from '@angular/router';
import { ViewerNoAccessService } from '@fussball/api';
import { LoginComponent } from '@fussball/shared';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    canLoad: [ViewerNoAccessService],
    pathMatch: 'full',
    loadChildren: () => import('@fussball/landing').then(m => m.LandingModule),
  },
  {
    path: 'players',
    canLoad: [ViewerNoAccessService],
    loadChildren: () => import('@fussball/players').then(m => m.PlayersModule),
  },
  {
    path: 'player',
    canLoad: [ViewerNoAccessService],
    loadChildren: () => import('@fussball/player').then(m => m.PlayerModule),
  },
  {
    path: 'info',
    loadChildren: () => import('@fussball/info').then(m => m.InfoModule),
  },
  {
    path: 'tables',
    loadChildren: () => import('@fussball/tables').then(m => m.TablesModule),
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
