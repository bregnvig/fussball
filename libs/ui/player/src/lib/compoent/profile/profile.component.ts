import { Component, OnInit } from '@angular/core';
import { PlayerFacade, PlayersActions, PlayersFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { truthy } from '@fussball/utils';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'fuss-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  receiveReminders$: Observable<boolean>;
  player$: Observable<Player>;
  players$: Observable<Player[]>;

  constructor(private facade: PlayerFacade, private playersFacade: PlayersFacade) {
  }

  ngOnInit(): void {
    this.playersFacade.dispatch(PlayersActions.loadPlayers());

    this.player$ = this.facade.player$.pipe(truthy(), first());
    this.players$ = this.playersFacade.allPlayers$.pipe(truthy());
  }
}
