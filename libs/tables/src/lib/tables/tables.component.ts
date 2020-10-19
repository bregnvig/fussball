import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayerFacade, TablesService } from '@fussball/api';
import { Table } from '@fussball/data';
import { truthy } from '@fussball/tools';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fussball-tables',
  templateUrl: './tables.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablesComponent implements OnInit {

  tables$: Observable<Table[]> = this.service.tables$;

  constructor(private service: TablesService, private playerFacade: PlayerFacade) { }

  ngOnInit(): void {
    this.tables$ = combineLatest([
      this.playerFacade.player$.pipe(truthy()),
      this.service.tables$.pipe(truthy())
    ]).pipe(
      map(([player, tables]) => tables.filter(t => t.name !== 'Test' || player.roles.includes('admin')))
    );
  }

}
