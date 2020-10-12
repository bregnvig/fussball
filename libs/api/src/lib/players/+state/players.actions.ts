import { Player } from '@fussball/data';
import { createAction, props } from "@ngrx/store";

const loadPlayers = createAction("[Players] Load Players");
const unloadPlayers = createAction("[Players] Unload players");

const loadPlayersSuccess = createAction(
  "[Players] Load Players Success",
  props<{ players: Player[]; }>()
);

const loadPlayersFailure = createAction(
  "[Players] Load Players Failure",
  props<{ error: any; }>()
);

const selectPlayer = createAction(
  '[Players] Select players',
  props<{ uid: string; }>(),
);

export const PlayersActions = {
  loadPlayers,
  loadPlayersSuccess,
  loadPlayersFailure,
  unloadPlayers,
  selectPlayer,
};
