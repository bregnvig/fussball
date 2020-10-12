import { Inject, Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { Player } from '@fussball/data';
import { GoogleFunctions } from '@fussball/firebase';
import { PlayerApiService } from '../../player';

@Injectable({
  providedIn: 'root'
})
export class PlayersApiService {
  constructor(
    private afs: AngularFirestore,
    @Inject(GoogleFunctions) private functions: firebase.functions.Functions) {
  }

  updatePlayer(uid: string, player: Partial<Player>): Promise<void> {
    return this.afs.doc(`${PlayerApiService.playersURL}/${uid}`).update(player);
  }
}