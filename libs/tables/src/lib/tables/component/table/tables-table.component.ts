import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Table } from '@fussball/data';

@Component({
  selector: 'fussball-tables-table',
  templateUrl: './tables-table.component.html',
  styleUrls: ['./tables-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesTableComponent implements OnInit {

  @Input() table: Table;

  constructor() { }

  ngOnInit(): void {
  }

}
