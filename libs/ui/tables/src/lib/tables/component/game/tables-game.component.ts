import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import { PlayerFacade, TablesService } from '@fussball/api';
import { Match, Table, Team } from '@fussball/data';
import { AbstractSuperComponent, AvatarClass } from '@fussball/shared';
import { shareLatest, truthy } from '@fussball/utils';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'fuss-tables-game',
  templateUrl: './tables-game.component.html',
  styleUrls: ['./tables-game.component.scss']
})
export class TablesGameComponent extends AbstractSuperComponent implements OnInit {

  table$: Observable<Table | undefined> = this.route.params.pipe(switchMap(({ id }) => id ? this.service.table(id) : of(undefined)), shareLatest());
  match$: Observable<Match | undefined> = this.table$.pipe(map(table => table?.game?.matches?.[table.game.matches.length - 1]), shareLatest());
  isPlayer$: Observable<boolean> = this.facade.player$.pipe(truthy(), map(({ roles }) => !!roles?.includes('player')));
  avatarClass: AvatarClass = 'gameAvatar';
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
  }

  winningTeam(table: Table): Team {
    return table.game.matches.reduce((acc, match) => acc + (match.team1 === 8 ? 1 : 0), 0) > Math.floor(table.game.numberOfMatches / 2) ? table.game.team1 : table.game.team2;
  }
}
