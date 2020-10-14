import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TableComponent } from './table/table.component';
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
      }
    ]),
  ],
})
export class TablesRoutingModule { }
