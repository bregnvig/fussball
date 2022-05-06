import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { firestoreUtils, JoinTableData, Position, Table, TABLES_COLLECTION } from '@fussball/data';
import { truthy } from '@fussball/utils';
import { combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerFacade } from './../../player/+state/player.facade';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  /**
   * 
  */
  private allTables$: Observable<Table[]> = this.afs.collection<Table>(TABLES_COLLECTION).snapshotChanges().pipe(
    map(snapshot => snapshot.map(s => ({ ...s.payload.doc.data(), id: s.payload.doc.id }))),
    map(firestoreUtils.convertTimestamps)
  );

  tables$: Observable<Table[]> = combineLatest([
    this.playerFacade.player$.pipe(truthy()),
    this.allTables$.pipe(truthy())
  ]).pipe(
    map(([player, tables]) => tables.filter(t => t.name !== 'Test' || player.roles?.includes('admin')))
  );

  constructor(
    private afs: AngularFirestore,
    private playerFacade: PlayerFacade,
    private functions: AngularFireFunctions,
  ) {
  }


  table(tableId: string): Observable<Table> {
    return this.afs.doc<Table>(`${TABLES_COLLECTION}/${tableId}`).valueChanges().pipe(map(firestoreUtils.convertTimestamps));
  };

  joinTable(tableId: string, position: Position): Observable<any> {
    const data: JoinTableData = { tableId, position, action: 'join' };
    return from(this.functions.httpsCallable('tableCallable')(data));
  }

}
