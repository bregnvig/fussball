import * as functions from 'firebase-functions';
import { validateAccess } from '../../lib';

export const version = functions.region('europe-west1').https.onCall(async (data: any, context) => {
  return validateAccess(context.auth?.uid, 'player')
    .then(() => ({
      api: 2,
      ui: 2
    }));
});
