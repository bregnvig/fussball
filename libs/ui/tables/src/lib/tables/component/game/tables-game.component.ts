import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import { PlayerFacade, TablesService } from '@fussball/api';
import { Match, Table, Team } from '@fussball/data';
import { AbstractSuperComponent } from '@fussball/shared';
import { shareLatest, truthy } from '@fussball/utils';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'fuss-tables-game',
  templateUrl: './tables-game.component.html',
  styleUrls: ['./tables-game.component.scss']
})
export class TablesGameComponent extends AbstractSuperComponent implements OnInit {

  table$: Observable<Table>;
  match$: Observable<Match>;
  isPlayer$: Observable<boolean>;
  avatarClass = "gameAvatar";
  showCongrats = true;

  constructor(
    private service: TablesService,
    private route: ActivatedRoute,
    private facade: PlayerFacade,
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
      this.takeUntilDestroyed(),
    );
    this.isPlayer$ = this.facade.player$.pipe(
      truthy(),
      map(player => player.roles.includes('player'))
    );

    this.match$ = this.table$.pipe(
      map(table => table.game.matches[table.game.matches.length - 1]),
      shareLatest(),
      this.takeUntilDestroyed(),
    );
  }

  winningTeam(table: Table): Team {
    return table.game.matches.reduce((acc, match) => acc + (match.team1 === 8 ? 1 : 0), 0) > Math.floor(table.game.numberOfMatches / 2) ? table.game.team1 : table.game.team2;
  }
}
