import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@fussball/shared';
import { TableComponent } from './table/table.component';
import { TablesComponent, TablesGameComponent, TablesTableComponent } from './tables';
import { TablesRoutingModule } from './tables-routing.module';
import { GameGoalsComponent } from './tables/component/game/game-goals/game-goals.component';
import { MatchGoalsComponent } from './tables/component/game/game-goals/match-goals/match-goals.component';

const matModules = [
  MatCardModule,
  MatButtonModule,
  MatTableModule,
];

@NgModule({
  declarations: [
    TablesComponent,
    TableComponent,
    TablesTableComponent,
    TablesGameComponent,
    GameGoalsComponent,
    MatchGoalsComponent,
  ],
  imports: [
    TablesRoutingModule,
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    RouterModule,
    matModules,
  ],
})
export class TablesModule { }
