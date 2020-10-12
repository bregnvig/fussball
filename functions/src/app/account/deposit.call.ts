import { transfer } from '../../lib/transactions.service';
import { logAndCreateError, validateAccess, internalError } from "../../lib";
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';

interface DepositData {
  amount: number;
  message: string;
  uid: string;
}

export const deposit = functions.region('europe-west1').https.onCall(async (data: DepositData, context) => {
  return validateAccess(context.auth?.uid, 'bank-admin')
    .then(() => buildDeposit(data))
    .then(() => true)
    .catch(internalError);
});

const buildDeposit = async ({ uid, amount, message }: DepositData) => {
  if (!uid) {
    throw logAndCreateError('not-found', `No uid specified for request `);
  }
  if (!amount) {
    throw logAndCreateError('failed-precondition', `No amount specified for uid: ${uid} `);
  }

  if (amount < 0) {
    throw logAndCreateError('failed-precondition', `Amount specified is negative. Amount: ${amount.toFixed(2)} specified for uid: ${uid} `);
  }

  return transfer({
    date: DateTime.local(),
    amount: amount,
    message: message,
    to: uid,
    involved: [uid]
  })
}
