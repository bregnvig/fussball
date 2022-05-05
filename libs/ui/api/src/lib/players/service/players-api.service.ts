import { Inject, Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { firestoreUtils, Player } from '@fussball/data';
import { GoogleFunctions } from '@fussball/firebase';
import { first } from 'rxjs/operators';
import { PlayerApiService } from '../../player';
import { TablesService } from '../../tables';

@Injectable({
  providedIn: 'root'
})
export class PlayersApiService {
  constructor(
    private afs: AngularFirestore,
    private tableService: TablesService,
    @Inject(GoogleFunctions) private functions: firebase.functions.Functions) {
  }

  updatePlayer(uid: string, player: Partial<Player>): Promise<void> {
    return this.afs.doc(`${PlayerApiService.playersURL}/${uid}`).update(player);
  }

  updateTeamName(id: string, name: string): Promise<void> {
    return this.afs.doc(`teams/${id}`).update({ name })
      .then(() => this.tableService.tables$.pipe(first()).toPromise())
      .then(tables => tables.reduce((acc, table) => {
        if (id == table.game.team1.id) {
          table.game.team1.name = name;
          acc.push(table);
        } else if (id === table.game.team2.id) {
          table.game.team2.name = name;
          acc.push(table);
        }
        return acc;
      }, []))
      .then(tables => this.afs.firestore.runTransaction(transaction => {
        return Promise.all(tables.map(table => transaction.set(this.afs.doc(`tables/${table.id}`).ref, { game: firestoreUtils.convertDateTimes(table.game) })));
      }))
      .then(() => null, error => console.error(error));
  }
}