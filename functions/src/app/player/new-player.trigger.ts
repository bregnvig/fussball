import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Player, sendMessage } from '../../lib';

export const newPlayerTrigger = functions.region('europe-west1').firestore.document('players/{playerId}')
  .onCreate(async (snapshot: functions.firestore.DocumentSnapshot) => {

    const db = admin.firestore();
    const newPlayer: Player = snapshot.data() as Player;
    const admins = (await db.collection('players').where('roles', 'array-contains', 'admin').get()).docs.map(d => d.data()) as Player[];
    console.log(`Found ${admins.length} admins`);

    return Promise.all(admins
      .filter(a => a.tokens && a.tokens.length)
      .map(a => sendMessage(a.tokens!, 'Ny spiller!', `${newPlayer.displayName} har tilmeldt sig!`))
    );
  });