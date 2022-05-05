import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TablesService } from '@fussball/api';
import { Table } from '@fussball/data';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'fuss-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  table$: Observable<Table | undefined> = this.route.params.pipe(switchMap(({ id }) => id ? this.service.table(id) : of(undefined)));

  constructor(private route: ActivatedRoute, private service: TablesService) { }

}
