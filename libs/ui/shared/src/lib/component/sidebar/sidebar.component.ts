import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PlayerActions, PlayerFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'fuss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  @Output() closing = new EventEmitter<void>();
  player$: Observable<Player | undefined> = this.playerFacade.player$;

  constructor(private playerFacade: PlayerFacade) { }

  signOut() {
    this.playerFacade.dispatch(PlayerActions.logoutPlayer());
  }
}
