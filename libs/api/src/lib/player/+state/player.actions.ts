import { Player } from '@fussball/data';
import { createAction, props } from '@ngrx/store';

export const PlayerActions = {

  loadPlayer: createAction('[Player] Load Player from player'),

  loadPlayerSuccess: createAction(
    '[Player] Load Player Success',
    props<{ player: Player; }>(),
  ),

  loadPlayerUnauthorized: createAction(
    '[Player] Load Player unauthorized',
  ),

  loadPlayerFailure: createAction(
    '[Player] Load Player Failure',
    props<{ error: any; }>(),
  ),

  updatePlayer: createAction(
    '[Player] Update player from profile',
    props<{ partialPlayer: Partial<Player>; }>()
  ),

  updatePlayerSuccess: createAction(
    '[Player] Update Player Success',
    props<{ partialPlayer: Partial<Player>; }>(),
  ),

  updatePlayerFailure: createAction(
    '[Player] Update Player failure',
    props<{ error: any; }>(),
  ),

  logoutPlayer: createAction('[Sidebar Menu] Logout player from application'),

  logoutPlayerSuccess: createAction(
    '[Player] Logout player Success',
  ),

  logoutPlayerFailure: createAction(
    '[Player] Logout player Failure',
    props<{ error: any; }>(),
  ),

  loadMessagingToken: createAction(
    '[Player] Load messaging token'
  ),

  loadMessingTokenFailure: createAction(
    '[Player] Load message token Failure',
    props<{ error: any; }>(),
  ),

  joinWBC: createAction('[Landing page] Join WBC'),
  joinWBCSuccess: createAction('[Player API] Join WBC Success'),
  joinWBCFailure: createAction('[Player API] Join WBC Failure', props<{ error: any; }>()),

  undoWBC: createAction('[Landing page] undo WBC'),
  undoWBCSuccess: createAction('[Player API] undo WBC Success'),
  undoWBCFailure: createAction('[Player API] undo WBC Failure', props<{ error: any; }>()),


};