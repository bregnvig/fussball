import * as functions from 'firebase-functions';
import { Player } from '../../lib';


export const setAnonymousRole = functions.region('europe-west1').firestore.document('players/{userId}')
  .onCreate(async (snap) => {
    const newUser: Player = snap.data() as Player;
    if (!newUser.roles || newUser.roles.length) {
      console.log(newUser?.displayName, ' with uid ', newUser?.uid, 'has signed up, assigning a default role');
    }
    return newUser.roles?.length
      ? Promise.resolve()
      : snap.ref.update({
        roles: ['anonymous']
      })
  });    