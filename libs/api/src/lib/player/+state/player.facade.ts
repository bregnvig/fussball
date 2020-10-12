import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromPlayer from './player.reducer';
import * as PlayerSelectors from './player.selectors';

@Injectable({
  providedIn: 'root'
})
export class PlayerFacade {
  loaded$ = this.store.pipe(select(PlayerSelectors.getPlayerLoaded));
  loading$ = this.store.pipe(select(PlayerSelectors.getPlayerLoading));
  updatingWBC$ = this.store.pipe(select(PlayerSelectors.getUpdatingWBC));
  player$ = this.store.pipe(select(PlayerSelectors.getPlayer));
  error$ = this.store.pipe(select(PlayerSelectors.getPlayerError));
  unauthorized$ = this.store.pipe(select(PlayerSelectors.getPlayerUnauthorized));
  authorized$ = this.store.pipe(select(PlayerSelectors.getPlayerAuthorized));

  constructor(private store: Store<fromPlayer.PlayerPartialState>) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
