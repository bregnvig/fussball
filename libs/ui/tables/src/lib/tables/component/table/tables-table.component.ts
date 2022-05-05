import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from '@fussball/data';

@Component({
  selector: 'fuss-tables-table',
  templateUrl: './tables-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesTableComponent implements OnInit {
  
  @Input() table: Table;

  tableId: string;
  
  constructor(private route: ActivatedRoute) {
  }
  
  ngOnInit(): void {
    this.tableId = this.route.snapshot.paramMap.get('id') ?? this.table.id;
  }

}
