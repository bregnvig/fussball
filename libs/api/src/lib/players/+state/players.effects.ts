import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { Player } from '@fussball/data';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { fetch } from "@nrwl/angular";
import { map, takeUntil } from 'rxjs/operators';
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

  constructor(private actions$: Actions, private afs: AngularFirestore) {
  }
}
