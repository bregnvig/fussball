import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Player, Team } from '@fussball/data';
import { truthy } from '@fussball/utils';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { fetch } from "@nrwl/angular";
import { of } from 'rxjs';
import { catchError, concatMap, debounce, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { PlayerActions } from '../../player';
import { PlayerFacade } from '../../player/+state';
import { PlayersActions } from './players.actions';


@Injectable({
  providedIn: 'root',
})
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
      debounce(() => this.playerFacade.authorized$.pipe(truthy())),
      withLatestFrom(this.playerFacade.player$.pipe(truthy())),
      concatMap((([_, player]) => this.afs.collection<Team>('teams', ref => ref.where('players', 'array-contains', player.uid)).valueChanges().pipe(
        map(teams => PlayersActions.loadTeamsSuccess({ teams })),
        catchError(error => of(PlayersActions.loadTeamsFailure({ error }))),
        takeUntil(this.actions$.pipe(ofType(PlayerActions.logoutPlayer))),
      )),
      ),
    ));

  constructor(private actions$: Actions, private afs: AngularFirestore, private playerFacade: PlayerFacade) {
  }
}