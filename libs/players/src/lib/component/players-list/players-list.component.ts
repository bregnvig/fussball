import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayersFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { truthy } from '@fussball/tools';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersListComponent implements OnInit {

  players$: Observable<Player[]>;

  constructor(private facade: PlayersFacade) { }

  ngOnInit(): void {
    this.players$ = this.facade.allPlayers$.pipe(
      truthy(),
    );
  }

  isAnonymous(player: Player): boolean {
    return player.roles.length === 1 && player.roles[0] === 'anonymous';
  }

  isPlayer(player: Player): boolean {
    return player.roles.indexOf('player') !== -1;
  }

  isAdmin(player: Player): boolean {
    return player.roles.indexOf('admin') !== -1;
  }
}
