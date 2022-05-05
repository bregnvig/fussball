import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from "@angular/router";
import { ControlModule } from '@fussball/control';
import { SharedModule } from '@fussball/shared';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { GameCompletedComponent } from './component/card/game-info/game-completed/game-completed.component';
import { GameInfoComponent } from './component/card/game-info/game-info.component';
import { GameOngoingComponent } from './component/card/game-info/game-ongoing/game-ongoing.component';
import { GamePreparingTeamComponent } from './component/card/game-info/game-preparing-team/game-preparing-team.component';
import { GamePreparingComponent } from './component/card/game-info/game-preparing/game-preparing.component';
import { PlayerStatComponent } from './component/card/player-stat/player-stat.component';
import { WhatElseComponent } from './component/card/what-else/what-else.component';
import { JoinTableErrorDialogComponent } from './component/join-table-error-dialog/join-table-error-dialog.component';
import { LandingComponent } from './component/landing/landing.component';
import { TableScannerComponent } from './component/table-scanner/table-scanner.component';

const MatModules = [
  MatCardModule,
  MatButtonModule,
  MatSnackBarModule,
  MatDialogModule,
  MatGridListModule,
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MatModules,
    ControlModule,
    ZXingScannerModule,
    RouterModule.forChild([
      {
        path: '',
        component: LandingComponent
      }
    ]),
  ],
  declarations: [
    LandingComponent,
    WhatElseComponent,
    TableScannerComponent,
    GameInfoComponent,
    GameOngoingComponent,
    GameCompletedComponent,
    GamePreparingComponent,
    GamePreparingTeamComponent,
    JoinTableErrorDialogComponent,
    PlayerStatComponent,
  ],
})
export class LandingModule { }
