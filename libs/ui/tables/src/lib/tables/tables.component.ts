import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TablesService } from '@fussball/api';
import { Table } from '@fussball/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'fussball-tables',
  templateUrl: './tables.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablesComponent {

  tables$: Observable<Table[]> = this.service.tables$;

  constructor(private service: TablesService,) { }

}
