import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@fussball/shared';
import { TableComponent } from './table/table.component';
import { TablesComponent, TablesGameComponent, TablesTableComponent } from './tables';
import { TablesRoutingModule } from './tables-routing.module';
import { GameGoalsComponent } from './tables/component/game/game-goals/game-goals.component';

const matModules = [
  MatCardModule,
  MatTableModule,
];

@NgModule({
  declarations: [
    TablesComponent,
    TableComponent,
    TablesTableComponent,
    TablesGameComponent,
    GameGoalsComponent,
  ],
  imports: [
    TablesRoutingModule,
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    matModules,
  ],
})
export class TablesModule { }
