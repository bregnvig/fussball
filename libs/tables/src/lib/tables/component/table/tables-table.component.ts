import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Table } from '@fussball/data';

@Component({
  selector: 'fussball-tables-table',
  templateUrl: './tables-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesTableComponent {

  @Input() table: Table;

}
