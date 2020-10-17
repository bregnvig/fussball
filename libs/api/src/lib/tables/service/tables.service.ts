import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestoreUtils, JoinTableData, Position, Table, TABLES_COLLECTION } from '@fussball/data';
import { GoogleFunctions } from '@fussball/firebase';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  tables$: Observable<Table[]> = this.afs.collection<Table>(TABLES_COLLECTION).valueChanges().pipe(map(firestoreUtils.convertTimestamps));

  constructor(
    private afs: AngularFirestore,
    @Inject(GoogleFunctions) private functions: firebase.functions.Functions,
  ) {
  }

  table(tableId: string): Observable<Table> {
    return this.afs.doc<Table>(`${TABLES_COLLECTION}/${tableId}`).valueChanges().pipe(map(firestoreUtils.convertTimestamps));
  }

  joinTable(tableId: string, position: Position): Observable<any> {
    const data: JoinTableData = { tableId, position, action: 'join' };
    return from(this.functions.httpsCallable('tableCallable')(data));
  }

}
