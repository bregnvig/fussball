import { Injectable } from "@angular/core";
import { Action, select, Store } from "@ngrx/store";
import * as fromPlayers from "./players.reducer";
import * as PlayersSelectors from "./players.selectors";



@Injectable()
export class PlayersFacade {
  error$ = this.store.pipe(select(PlayersSelectors.getPlayersError));
  loaded$ = this.store.pipe(select(PlayersSelectors.getPlayersLoaded));
  allPlayers$ = this.store.pipe(select(PlayersSelectors.getAllPlayers));
  selectedPlayer$ = this.store.pipe(select(PlayersSelectors.getSelected));
  allTeams$ = this.store.pipe(select(PlayersSelectors.getAllTeams));

  constructor(private store: Store<fromPlayers.PlayersPartialState>) { }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
