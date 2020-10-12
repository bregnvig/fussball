import { playerWithoutBid } from './../../lib/reminder.service';
import * as functions from 'firebase-functions';
import { internalError, validateAccess } from '../../lib';

export const withoutBid = functions.region('europe-west1').https.onCall(async (data: unknown, context) => {
  return validateAccess(context.auth?.uid, 'admin')
    .then(() => playerWithoutBid())
    .catch(internalError);
});
