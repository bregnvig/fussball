import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PLAYER_FEATURE_KEY,
  State,
  PlayerPartialState,
} from './player.reducer';

// Lookup the 'User' feature state managed by NgRx
export const getPlayerState = createFeatureSelector<PlayerPartialState, State>(
  PLAYER_FEATURE_KEY
);

export const getPlayerLoaded = createSelector(
  getPlayerState,
  (state: State) => state.loaded
);

export const getPlayerLoading = createSelector(
  getPlayerState,
  (state: State) => state.loading
);

export const getUpdatingWBC = createSelector(
  getPlayerState,
  (state: State) => state.updatingWBC
);

export const getPlayerError = createSelector(
  getPlayerState,
  (state: State) => state.error
);

export const getPlayerUnauthorized = createSelector(
  getPlayerState,
  (state: State) => state.unauthorized
);

export const getPlayerAuthorized = createSelector(
  getPlayerState,
  (state: State) => state.authorized
);

export const getPlayer = createSelector(
  getPlayerState,
  (state: State) => state.player
);

