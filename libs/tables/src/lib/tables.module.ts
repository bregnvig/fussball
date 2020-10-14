import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from '@fussball/shared';
import { TableComponent } from './component/table/table.component';
import { TablesComponent } from './component/tables/tables.component';
import { TablesRoutingModule } from './tables-routing.module';

@NgModule({
  declarations: [
    TablesComponent,
    TableComponent,
  ],
  imports: [
    TablesRoutingModule,
    CommonModule,
    SharedModule,
  ],
})
export class TablesModule { }
