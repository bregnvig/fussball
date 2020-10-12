import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  PLAYERS_FEATURE_KEY,
  State,
  PlayersPartialState,
  playersAdapter
} from "./players.reducer";

// Lookup the 'Players' feature state managed by NgRx
export const getPlayersState = createFeatureSelector<
  PlayersPartialState,
  State
>(PLAYERS_FEATURE_KEY);

const { selectAll, selectEntities } = playersAdapter.getSelectors();

export const getPlayersLoaded = createSelector(
  getPlayersState,
  (state: State) => state.loaded
);

export const getPlayersError = createSelector(
  getPlayersState,
  (state: State) => state.error
);

export const getAllPlayers = createSelector(getPlayersState, (state: State) =>
  selectAll(state)
);

export const getPlayersEntities = createSelector(
  getPlayersState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getPlayersState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getPlayersEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
