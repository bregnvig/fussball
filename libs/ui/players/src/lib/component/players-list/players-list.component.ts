import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlayersFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { truthy } from '@fussball/utils';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersListComponent {

  players$: Observable<Player[]> = this.facade.allPlayers$.pipe(truthy());

  constructor(private facade: PlayersFacade) { }

  isAnonymous(player: Player): boolean {
    return player.roles?.length === 1 && player.roles[0] === 'anonymous';
  }

  isPlayer(player: Player): boolean {
    return player.roles?.indexOf('player') !== -1;
  }

  isViewer(player: Player): boolean {
    return player.roles?.indexOf('viewer') !== -1;
  }

  isAdmin(player: Player): boolean {
    return player.roles?.indexOf('admin') !== -1;
  }
}
