
// const clone = require('clone');

import { assertSucceeds } from "@firebase/testing";
import { playersURL, seasonsURL } from "../../lib/collection-names";
import { collections } from "../../test-utils";
import { adminApp, authedApp, clearFirestoreData } from "../../test-utils/firestore-test-utils";

describe('Reminder unittest', () => {

 let adminFirestore: firebase.firestore.Firestore;

  // const writeBid = async (bid: any, uid: string) => adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${uid}`).set(bid);
  // const readBid = async (uid: string): Promise<Bid> => adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${uid}`).get().then(ref => ref.data() as Bid);

  beforeEach(async () => {
    adminFirestore = adminApp();
    await adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).set({ ...collections.players.admin });
    await adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).set({ ...collections.players.player });
    await adminFirestore.doc(`${playersURL}/${collections.players.player1.uid}`).set({ ...collections.players.player1 });
    await adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).set({ ...collections.players.bookie });

    await adminFirestore.doc(`${seasonsURL}/9999`).set(collections.seasons[0]);
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set({ ...collections.races[1], state: 'open' });
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/1`).set({ ...collections.bids[1] });
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/2`).set({ ...collections.bids[0], submitted: true });
  });

  afterEach(async () => {
    await clearFirestoreData();
  });

  it('should have firebase initialized', async () => {
    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('withoutBid')())
      .then((result: firebase.functions.HttpsCallableResult) => expect(result.data.length).toBe(2));
  });
});