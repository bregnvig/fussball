import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Table, TABLES_COLLECITON } from '@fussball/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  tables$: Observable<Table[]> = this.afs.collection<Table>(TABLES_COLLECITON).valueChanges({ idField: 'id' });

  constructor(private afs: AngularFirestore) {
  }

}
