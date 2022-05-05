import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { PlayersApiModule } from '@fussball/api';
import { SharedModule } from '@fussball/shared';
import { PlayersListComponent } from './component/players-list/players-list.component';
import { PlayersComponent } from './component/players/players.component';
import { TeamNameDialogComponent } from './component/team-name-dialog/team-name-dialog.component';
import { TeamsListComponent } from './component/teams-list/teams-list.component';
import { EditPlayerComponent } from './edit-player/edit-player.component';

const MatModules = [
  MatListModule,
  MatCardModule,
  MatCheckboxModule,
  MatButtonModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatSnackBarModule,
];
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PlayersComponent,
        children: [
          {
            path: 'teams',
            component: TeamsListComponent
          },
          {
            path: '',
            component: PlayersListComponent
          },
          {
            path: ':id',
            component: EditPlayerComponent
          }
        ]
      }
    ]),
    CommonModule,
    SharedModule,
    PlayersApiModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatModules,
  ],
  declarations: [PlayersListComponent, PlayersComponent, EditPlayerComponent, TeamsListComponent, TeamNameDialogComponent]
})
export class PlayersModule {

}