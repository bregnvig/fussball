import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
export class GameInfoComponent implements OnInit {

  tables$: Observable<Table[]>;
  trackByFn = trackByProperty('name');

  constructor(private service: TablesService) { }

  ngOnInit(): void {
    this.tables$ = this.service.tables$.pipe(map(tables => tables.filter(t => t.game)));
  }


}
