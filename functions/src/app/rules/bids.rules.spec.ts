import { permissionDenied } from '../../test-utils/firestore-test-utils';
import { assertSucceeds, assertFails } from '@firebase/testing';
import { adminApp, authedApp, clearFirestoreData } from '../../test-utils/firestore-test-utils';
import { collections } from '../../test-utils';
import { playersURL, seasonsURL } from '../../lib/collection-names';

const clone = require('clone');

describe('bids rules', () => {

  let adminFirestore: firebase.firestore.Firestore;

  const writeBid = async (bid: any, uid: string) => adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${uid}`).set(bid);

  beforeEach(async () => {
    adminFirestore = adminApp();
    await adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).set({ ...collections.players.player });
    await adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).set({ ...collections.players.admin });
    await adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).set({ ...collections.players.bookie });
    await adminFirestore.doc(`${playersURL}/${collections.players.bankadmin.uid}`).set({ ...collections.players.bankadmin });
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set(collections.races[1]);
   });

  afterEach(async () => {
    await clearFirestoreData();
  });

  it('Access to transactions checks - submitted bids', async () => {

    await writeBid({ ...clone(collections.bids[0]), submitted: true }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.admin.uid}`).get())
    await assertSucceeds(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.player.uid}`).get())
    await assertFails(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.admin.uid}`).update({submitted: false})).then(permissionDenied)
    await assertFails(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.player.uid}`).update({firstCrash: [ 'hammilton' ]})).then(permissionDenied)
     });

  it('Access to bids checks - user not submitted bid', async () => {

    await writeBid({ ...clone(collections.bids[0]), submitted: true }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]) }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.player.uid });
    await assertSucceeds(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.player.uid}`).get())
    await assertFails(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.admin.uid}`).get()).then(permissionDenied)
    await assertFails(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.player.uid}`).update({submitted: false})).then(permissionDenied)
    await assertFails(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.admin.uid}`).update({submitted: true})).then(permissionDenied)
    await assertSucceeds(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.player.uid}`).update({firstCrash: [ 'hammilton' ]}))
   });

  it('non-player should not be allowed to read transaction', async () => {
    const app = await authedApp({ uid: 'non-player-id' });
    await assertFails(app.firestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${collections.players.player.uid}`).get()).then(permissionDenied)
  });
  
});
