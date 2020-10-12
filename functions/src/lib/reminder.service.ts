import { playersURL } from './collection-names';
import * as admin from 'firebase-admin';
import { getCurrentRace } from './race.service';
import { Player, Bid } from "./model";
import { seasonsURL, racesURL } from '.';


export const playerWithoutBid = async (): Promise<Player[]> => {

  
  const currentRace = await getCurrentRace('open');
  
  const db = admin.firestore();
  const played: Set<string> = await db.collection(`${seasonsURL}/${currentRace!.season}/${racesURL}/${currentRace?.round}/bids`)
  .get()
  .then(snapshot => snapshot.docs.map(d => d.data() as Bid))
  .then(bids => bids.filter(bid => bid.submitted))
  .then(bids => bids.map(b => b.player!.uid))
  .then((uids: string[]) => new Set<string>(uids));

  const players = await db.collection(`${playersURL}`)
    .where('roles', 'array-contains', 'player')
    .get()
    .then(snapshot => snapshot.docs.map(d => d.data() as Player));
  return players.filter(player => !played.has(player.uid) && player.receiveReminders !== false)
}