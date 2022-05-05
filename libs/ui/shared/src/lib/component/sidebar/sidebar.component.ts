import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlayerActions, PlayerFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'fuss-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

  @Output() closing = new EventEmitter<void>();
  player$: Observable<Player>;

  constructor(private playerFacade: PlayerFacade) { }

  ngOnInit(): void {
    this.player$ = this.playerFacade.player$;
  }

  signOut() {
    this.playerFacade.dispatch(PlayerActions.logoutPlayer());
  }
}
