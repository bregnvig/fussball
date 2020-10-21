import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { Player, TeamS } from '@fussball/data';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { fetch } from "@nrwl/angular";
import { of } from 'rxjs';
import { catchError, concatMap, map, takeUntil } from 'rxjs/operators';
import { PlayerActions } from '../../player';
import { PlayersActions } from './players.actions';


@Injectable()
export class PlayersEffects {
  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.loadPlayers),
      fetch({
        run: action => {
          return this.afs.collection<Player>('players').valueChanges().pipe(
            map(players => PlayersActions.loadPlayersSuccess({ players })),
            takeUntil(this.actions$.pipe(ofType(PlayersActions.loadPlayers, PlayersActions.unloadPlayers)))
          );
        },
        onError: (action, error) => {
          console.error("Error", error);
          return PlayersActions.loadPlayersFailure({ error });
        }
      }),
    )
  );
  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.loadTeams),
      concatMap(() => this.afs.collection<TeamS>('teams').valueChanges().pipe(
        map(teams => PlayersActions.loadTeamsSuccess(teams.reduce((acc, team) => {
          acc[`${team.player1}_${team.player2}`] = team;
          return acc;
        }, {}))),
        catchError(error => of(PlayersActions.loadTeamsFailure({ error }))),
        takeUntil(this.actions$.pipe(ofType(PlayerActions.logoutPlayer))),
      )),
    ),
  );

  constructor(private actions$: Actions, private afs: AngularFirestore) {
  }
}

/**
 *         map(teams => PlayersActions.loadTeamsSuccess({ teams: teams.reduce((acc, team) => {
          acc[`${team.player1}_${team.player2}`] = team;
          return acc;
        }, {}) })),

 */