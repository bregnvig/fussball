import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { IRace, seasonsURL, racesURL, updateRace } from '../../lib';

const db = admin.firestore();

/**
 * This trigger opens the next race, when the previous completes.
 */
export const openRace = functions.region('europe-west1').firestore.document('seasons/{seasonId}/races/{round}')
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>, context: functions.EventContext) => {
    const before: IRace = change.before.data() as IRace;
    const after: IRace = change.after.data() as IRace;
    if (before.state === 'closed' && after.state === 'completed') {
      const nextRace: IRace | null = await db.doc(`${seasonsURL}/${context.params.seasonId}/${racesURL}/${after.round + 1}`)
        .get()
        .then(snapshot => snapshot.exists ? snapshot.data() as IRace : null);
      
      if (nextRace) {
        console.log(`Opening ${nextRace.name}`);
        return updateRace(nextRace.season, nextRace.round, {state: 'open'});
      }
    }
    return Promise.resolve(true);
  });
