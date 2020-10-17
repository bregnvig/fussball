import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { JoinTableData, Position, Table, TABLES_COLLECTION } from '@fussball/data';
import { GoogleFunctions } from '@fussball/firebase';
import { from, Observable } from 'rxjs';
import { PlayerFacade } from '../../player/+state';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  tables$: Observable<Table[]> = this.afs.collection<Table>(TABLES_COLLECTION).valueChanges({ idField: 'id' });

  constructor(
    private afs: AngularFirestore,
    private playerFacade: PlayerFacade,
    @Inject(GoogleFunctions) private functions: firebase.functions.Functions,
  ) {
  }

  table(tableId: string): Observable<Table> {
    return this.afs.doc<Table>(`${TABLES_COLLECTION}/${tableId}`).valueChanges();
  }

  joinTable(tableId: string, position: Position): Observable<any> {
    const data: JoinTableData = { tableId, position, action: 'join' };
    return from(this.functions.httpsCallable('tableCallable')(data));
  }

}
