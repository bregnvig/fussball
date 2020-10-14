import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        // list of tables
      },
      {
        path: ':id',
        // table id status and players
      }
    ]),
  ],
})
export class TablesModule { }
