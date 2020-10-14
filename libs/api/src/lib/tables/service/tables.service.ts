import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game, PlayerPosition, Position, Table, TABLES_COLLECITON } from '@fussball/data';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PlayerFacade } from '../../player/+state';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  tables$: Observable<Table[]> = this.afs.collection<Table>(TABLES_COLLECITON).valueChanges({ idField: 'id' });

  constructor(private afs: AngularFirestore, private playerFacade: PlayerFacade) {
  }

  table(tableId: string): Observable<Table> {
    return this.afs.doc<Table>(`${TABLES_COLLECITON}/${tableId}`).valueChanges();
  }

  joinGame(tableId: string, position: Position): Observable<any> {
    return this.playerFacade.player$.pipe(
      switchMap(player => {
        return this.afs
          .doc<Table>(`${TABLES_COLLECITON}/${tableId}`)
          .update({
            game: {
              latestPosition: { [position]: player.uid } as any as PlayerPosition
            } as any as Game
          });

      }),
    );

  }

}
