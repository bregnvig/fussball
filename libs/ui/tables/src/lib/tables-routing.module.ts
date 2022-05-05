import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ViewerNoAccessService } from '@fussball/api';
import { TableComponent } from './table/table.component';
import { TablesGameComponent } from './tables/component';
import { TablesComponent } from './tables/tables.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        canActivate: [ViewerNoAccessService],
        component: TablesComponent,
      },
      {
        path: ':id',
        canActivate: [ViewerNoAccessService],
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
