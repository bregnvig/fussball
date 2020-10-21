import { Player, TeamS } from '@fussball/data';
import { createAction, props } from "@ngrx/store";

export const PlayersActions = {
  loadPlayers: createAction("[Players] Load Players"),
  unloadPlayers: createAction("[Players] Unload players"),
  loadPlayersSuccess: createAction("[Players] Load Players Success",
    props<{ players: Player[]; }>()
  ),
  loadPlayersFailure: createAction(
    "[Players] Load Players Failure",
    props<{ error: any, }>()
  ),

  selectPlayer: createAction(
    '[Players] Select players',
    props<{ uid: string, }>(),
  ),

  loadTeams: createAction("[Teams] Load Teams"),

  loadTeamsSuccess: createAction(
    "[Teams] Load Teams Success",
    props<{ [key: string]: TeamS, }>()
  ),

  loadTeamsFailure: createAction(
    "[Teams] Load Teams Failure",
    props<{ error: any, }>()
  ),

  selectTeam: createAction(
    '[Teams] Select team',
    props<{ id: string, }>(),
  ),

};