import { Component, OnInit } from '@angular/core';
import { TablesService } from '@fussball/api';
import { Table } from '@fussball/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'fussball-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {

  tables$: Observable<Table[]> = this.service.tables$;

  constructor(private service: TablesService) { }

  ngOnInit(): void {
  }

}
