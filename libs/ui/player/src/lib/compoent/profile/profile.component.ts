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

  player$: Observable<Player> = this.facade.player$.pipe(truthy(), first());
  players$: Observable<Player[]>  = this.playersFacade.allPlayers$.pipe(truthy());

  constructor(private facade: PlayerFacade, private playersFacade: PlayersFacade) {
  }

  ngOnInit(): void {
    this.playersFacade.dispatch(PlayersActions.loadPlayers());
  }
}
