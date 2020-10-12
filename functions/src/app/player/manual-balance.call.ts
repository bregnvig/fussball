import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { internalError, validateAccess } from "../../lib";
import { playersURL } from './../../lib/collection-names';

interface BalanceData {
  uid: string;
  balance: number;
}

export const manualBalance = functions.region('europe-west1').https.onCall(async (data: BalanceData, context) => {

  return validateAccess(context.auth?.uid, 'bank-admin')
    .then(() => updateBalance(data))
    .then(() => true)
    .catch(internalError);
});

const updateBalance = async ({ uid, balance }: BalanceData) => {
  const db = admin.firestore();
  return db.doc(`${playersURL}/${uid}`).update({ balance });
}
