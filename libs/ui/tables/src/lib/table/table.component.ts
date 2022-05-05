import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TablesService } from '@fussball/api';
import { Table } from '@fussball/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'fuss-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  tableId: string;
  table$: Observable<Table>;

  constructor(private route: ActivatedRoute, private service: TablesService) { }

  ngOnInit(): void {
    this.tableId = this.route.snapshot.paramMap.get('id');
    this.table$ = this.service.table(this.tableId);
  }

}
