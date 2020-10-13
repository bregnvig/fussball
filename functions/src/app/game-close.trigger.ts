import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { playedURL } from './../lib/collection-names';
import { Table } from './../lib/model/table.model';

export const gameCloseTrigger = functions.region('europe-west1').firestore.document('tables/{tableId}')
  .onUpdate(async (change, context) => {
    const before: Table = change.before.data() as Table;
    const after: Table = change.after.data() as Table;
    if (before.game?.state !== 'completed' && after.game?.state === 'completed') {
      const db = admin.firestore();
      await db.collection(playedURL(change.after.id)).doc().set(after.game);
    }
    return null;
  });    