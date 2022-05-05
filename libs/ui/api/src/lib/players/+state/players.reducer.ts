import { Player, Team } from '@fussball/data';
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from '@ngrx/store';
import { PlayersActions } from './players.actions';

export const PLAYERS_FEATURE_KEY = "players";

export interface State extends EntityState<Player> {
  selectedId?: string; // which Players record has been selected
  loaded: boolean; // has the Players list been loaded
  error?: string | null; // last none error (if any)
  teams?: Team[];
  teamsLoaded: boolean; // has the Players list been loaded
}

export interface PlayersPartialState {
  readonly [PLAYERS_FEATURE_KEY]: State;
}

export const playersAdapter: EntityAdapter<Player> = createEntityAdapter<Player>({
  sortComparer: (a, b) => a.displayName.localeCompare(b.displayName),
  selectId: a => a.uid
});

const initialState = playersAdapter.getInitialState({
  loaded: false
});

const playersReducer = createReducer(
  initialState,
  on(PlayersActions.loadPlayers, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(PlayersActions.loadPlayersSuccess, (state, { players }) =>
    playersAdapter.setAll(players, { ...state, loaded: true })
  ),
  on(PlayersActions.selectPlayer, (state, { uid }) => ({ ...state, selectedId: uid })),
  on(PlayersActions.loadTeams, state => ({
    ...state,
    teamsLoaded: false,
    error: null
  })),
  on(PlayersActions.loadTeamsSuccess, (state, { teams }) =>
    ({ ...state, teamsLoaded: true, teams })
  ),
  on(PlayersActions.selectPlayer, (state, { uid }) => ({ ...state, selectedId: uid })),
  on(PlayersActions.selectTeam, (state, { id }) => ({ ...state, selectedTeamId: id })),
  on(PlayersActions.loadPlayersFailure, PlayersActions.loadTeamsFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(PlayersActions.unloadPlayers, state => initialState)
);

export function reducer(state: State | undefined, action: Action) {
  return playersReducer(state, action);
};
