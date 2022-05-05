import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TablesService } from '@fussball/api';
import { Table } from '@fussball/data';
import { trackByProperty } from '@fussball/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fuss-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameInfoComponent {

  tables$: Observable<Table[]> = this.service.tables$.pipe(map(tables => tables.map(table => table).filter(t => !!t.game)));
  trackByFn = trackByProperty<Table>('name');

  constructor(private service: TablesService) { }

}
