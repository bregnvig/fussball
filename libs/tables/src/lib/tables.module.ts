import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '@fussball/shared';
import { TableComponent } from './table/table.component';
import { TablesComponent, TablesGameComponent, TablesTableComponent } from './tables';
import { TablesRoutingModule } from './tables-routing.module';

const matModules = [
  MatCardModule
];

@NgModule({
  declarations: [
    TablesComponent,
    TableComponent,
    TablesTableComponent,
    TablesGameComponent,
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