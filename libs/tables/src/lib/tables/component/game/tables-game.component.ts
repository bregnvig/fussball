import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import { TablesService } from '@fussball/api';
import { Match, Table } from '@fussball/data';
import { AbstractSuperComponent } from '@fussball/shared';
import { shareLatest } from '@fussball/tools';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'fussball-tables-game',
  templateUrl: './tables-game.component.html',
  styleUrls: ['./tables-game.component.scss']
})
export class TablesGameComponent extends AbstractSuperComponent implements OnInit {

  table$: Observable<Table>;
  match$: Observable<Match>;
  avatarClass = "gameAvatar";

  constructor(
    private service: TablesService,
    private route: ActivatedRoute,
    private mediaObserver: MediaObserver) {
    super();
  }

  ngOnInit(): void {
    this.mediaObserver.asObservable().pipe(
      map(queries => queries.some(q => q.mqAlias === 'lt-sm')),
      this.takeUntilDestroyed(),
    ).subscribe(isSmall => this.avatarClass = isSmall ? 'avatar' : 'gameAvatar');
    this.table$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.service.table(id)),
      shareLatest(),
    );

    this.match$ = this.table$.pipe(
      map(table => table.game.matches[table.game.matches.length - 1]),
      shareLatest(),
    );
  }
}
