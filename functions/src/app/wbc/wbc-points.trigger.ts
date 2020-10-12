import { WBCResult } from './../../lib/model/wbc.model';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Bid, IRace, racesURL, seasonsURL, Player } from '../../lib';

const db = admin.firestore();
const wbcPoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
/**
 * The struture fo the WBC is:
 * seasons/{seasonId} wbc[] - {round}: {race, players[]}
 */
export const wbcPointsTrigger = functions.region('europe-west1').firestore.document('seasons/{seasonId}/races/{round}')
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>, context: functions.EventContext) => {
    const before: IRace = change.before.data() as IRace;
    const after: IRace = change.after.data() as IRace;
    if (before.state === 'closed' && after.state === 'completed') {
      const bids: Bid[] = await db.collection(`${seasonsURL}/${context.params.seasonId}/${racesURL}/${context.params.round}/bids`)
        .where('submitted', '==', true)
        .orderBy('points', 'desc')
        .orderBy('polePositionTimeDiff', 'asc')
        .get()
        .then(snapshot => snapshot.docs.map(s => s.data() as Bid));
      await createWBCRace(after, bids, db.doc(`${seasonsURL}/${context.params.seasonId}`));
    }
    return Promise.resolve(true);
  });

const createWBCRace = async (race: IRace, bids: Bid[], ref: admin.firestore.DocumentReference) => {
  const entry: WBCResult = {
    raceName: race.name,
    round: race.round,
    countryCode: race.countryCode,
    players: bids.map((bid, index) => ({
      player: {
        displayName: bid.player?.displayName,
        photoURL: bid.player?.photoURL ?? null,
        uid: bid.player?.uid,
        email: bid.player?.email,
        tokens: bid.player?.tokens ?? [],
      } as Player,
      points: bid.points && wbcPoints[index] || 0
    }))
  };
  bids.forEach((b, index) => {
    console.log(b.player?.displayName, 'Points', b.points, 'WBC', wbcPoints[index]);
  });
  return ref.set({
    wbc: {
      results: admin.firestore.FieldValue.arrayUnion(entry)
    }
  }, { merge: true });
};
