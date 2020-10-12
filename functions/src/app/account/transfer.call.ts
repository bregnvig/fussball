import { transfer as transferTransaction} from '../../lib/transactions.service';
import { logAndCreateError, PlayerImpl, validateAccess, getUser, internalError } from "../../lib";
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';

const validateBalance = (player: PlayerImpl, amount: number): void => {
  if ((player.balance || 0) - amount < 0) {
    throw logAndCreateError('failed-precondition', `${player.displayName} has insufficient funds to withdraw ${amount}. Balance: ${(player.balance || 0).toFixed(2)}`)
  }
}

interface TransferData {
  amount: number;
  message: string;
  fromUid: string;
  toUid: string
}

export const transfer = functions.region('europe-west1').https.onCall(async (data: TransferData, context) => {
  return validateAccess(context.auth?.uid, 'bank-admin')
    .then(() => buildWithdraw(data))
    .then(() => true)
    .catch(internalError);
});

const buildWithdraw = async ({ fromUid, toUid, amount, message }: TransferData) => {

  if (!fromUid) {
    throw logAndCreateError('not-found', `No from uid specified for request `);
  }
  if (!toUid) {
    throw logAndCreateError('not-found', `No to uid specified for request `);
  }

  if (fromUid === toUid) {
    throw logAndCreateError('failed-precondition', `From and to uid are identical`);
  }

  const from = await getUser(fromUid);
  if (!from) {
    throw logAndCreateError('not-found', `The from player with uid: ${fromUid} not found`)
  }
  const to = await getUser(toUid);
  if (!to) {
    throw logAndCreateError('not-found', `The to player with uid: ${toUid} not found`)
  }
  if (!amount) {
    throw logAndCreateError('failed-precondition', `No amount specified for player: ${from.displayName} `);
  }  
  if (amount < 0) {
    throw logAndCreateError('failed-precondition', `Negative amount specified for player: ${from.displayName} `);
  }  
  validateBalance(from, amount);

  return transferTransaction({
    date: DateTime.local(),
    amount: amount,
    message: message,
    from: fromUid,
    to: toUid,
    involved: [fromUid, toUid],
  });
}
