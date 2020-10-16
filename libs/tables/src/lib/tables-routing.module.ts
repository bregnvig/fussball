import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TableComponent } from './table/table.component';
import { TablesGameComponent } from './tables/component';
import { TablesComponent } from './tables/tables.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: TablesComponent,
      },
      {
        path: ':id',
        component: TableComponent,
      },
      {
        path: ':id/game',
        component: TablesGameComponent,
      }
    ]),
  ],
})
export class TablesRoutingModule { }
