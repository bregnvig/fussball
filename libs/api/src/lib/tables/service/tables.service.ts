import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestoreUtils, Game, PlayerPosition, Position, Table, TABLES_COLLECTION } from '@fussball/data';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PlayerFacade } from '../../player/+state';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  tables$: Observable<Table[]> = this.afs.collection<Table>(TABLES_COLLECTION).valueChanges().pipe(map(firestoreUtils.convertTimestamps));

  constructor(private afs: AngularFirestore, private playerFacade: PlayerFacade) {
  }

  table(tableId: string): Observable<Table> {
    return this.afs.doc<Table>(`${TABLES_COLLECTION}/${tableId}`).valueChanges().pipe(map(firestoreUtils.convertTimestamps));
  }

  joinGame(tableId: string, position: Position): Observable<any> {
    return this.playerFacade.player$.pipe(
      switchMap(player => {
        return this.afs
          .doc<Table>(`${TABLES_COLLECTION}/${tableId}`)
          .update({
            game: {
              latestPosition: { [position]: player.uid } as any as PlayerPosition
            } as any as Game
          });

      }),
    );

  }

}
