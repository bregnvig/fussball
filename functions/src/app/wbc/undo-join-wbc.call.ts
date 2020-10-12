import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateAccess, internalError, logAndCreateError, PlayerImpl, ISeason, currentSeason, getBookie, seasonsURL, transferInTransaction } from '../../lib';
import { DateTime } from 'luxon';

export const undoWBC = functions.region('europe-west1').https.onCall(async (data: any, context) => {
  return validateAccess(context.auth?.uid, 'player')
    .then(player => undo(player))
    .then(() => true)
    .catch(internalError);
});

const undo = async (player: PlayerImpl) => {
  const season: ISeason = await currentSeason();

  if (season.wbc.latestWBCJoinDate < DateTime.local()) {
    throw logAndCreateError('failed-precondition', `It's too late to undo join WBC.`);
  }

  const participants: string[] = season.wbc?.participants ?? [];
  if (participants.includes(player.uid) === false) {
    throw logAndCreateError('failed-precondition', `${player.displayName} never joined WBC`);
  }

  const db = admin.firestore();
  const bookie = await getBookie();
  const doc = db.doc(`${seasonsURL}/${season.id}`);
  return db.runTransaction(transaction => {
    transaction.set(doc, {
      wbc: {
        participants: admin.firestore.FieldValue.arrayRemove(player.uid)
      }
    }, { merge: true });
    transferInTransaction({
      date: DateTime.local(),
      amount: 100,
      message: `Fortrød deltagelse i WBC`,
      from: bookie.uid,
      to: player.uid,
      involved: [player.uid, bookie.uid],
    }, transaction);
    return Promise.resolve('WBC undone');
  });
};

