import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { PlayerApiModule, PlayersApiModule } from '@fussball/api';
import { FirebaseModule } from '@fussball/firebase';
import { ProfileComponent } from './compoent/profile/profile.component';

const MaterialModulde = [
  MatListModule,
  MatButtonModule,
  MatToolbarModule,
  MatSlideToggleModule,
  MatIconModule,
];

@NgModule({
  imports: [
    CommonModule,
    FirebaseModule,
    MaterialModulde,
    PlayerApiModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent
      }
    ]),
    PlayerApiModule,
    PlayersApiModule,
  ],
  declarations: [
    ProfileComponent
  ]
})
export class PlayerModule {
}
