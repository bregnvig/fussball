import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { IRace } from '../../lib';
import { racesURL, seasonsURL } from './../../lib/collection-names';

const db = admin.firestore();

/**
 * This trigger copies the drivers from the previous race to the new race.
 */
export const raceDrivers = functions.region('europe-west1').firestore.document('seasons/{seasonId}/races/{round}')
    .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>, context: functions.EventContext) => {
        const before: IRace = change.before.data() as IRace;
        const after: IRace = change.after.data() as IRace;
        if (before.state === 'waiting' && after.state === 'open' && before.round !== 1) {
            const previousRace: IRace = await db.collection(`${seasonsURL}/${context.params.seasonId}/${racesURL}`)
                .where('state', '==', 'completed')
                .where('round', '<', before.round)
                .orderBy('round', 'desc')
                .get()
                .then(snapshot => snapshot.docs[0].data() as IRace);
            await db.doc(`${seasonsURL}/${context.params.seasonId}/${racesURL}/${context.params.round}`).update({ drivers: previousRace.drivers });
        }
        return Promise.resolve(true);
    });
