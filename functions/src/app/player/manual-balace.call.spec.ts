import { assertFails, assertSucceeds } from '@firebase/testing';
import { collections } from '../../test-utils';
// import { test } from '../../test-utils/firebase-initialize';
import { adminApp, authedApp, clearFirestoreData, unauthenticated } from '../../test-utils/firestore-test-utils';
import { players } from '../../test-utils/players.collection';
import { playersURL } from './../../lib/collection-names';
import { permissionDenied } from './../../test-utils/firestore-test-utils';

describe('Manual balance unittest', () => {

  let adminFirestore: firebase.firestore.Firestore;

  const readPlayer = async (uid: string) => adminFirestore.doc(`${playersURL}/${uid}`).get().then(snapshot => snapshot.data());

  beforeEach(async () => {
    // depositFn = test.wrap(deposit);
    adminFirestore = adminApp();
    await adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).set({ ...collections.players.player });
    await adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).set({ ...collections.players.admin });
    await adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).set({ ...collections.players.bookie });
    await adminFirestore.doc(`${playersURL}/${collections.players.bankadmin.uid}`).set({ ...collections.players.bankadmin });
  });

  afterEach(async () => {
    await clearFirestoreData();
  })

  it('should deny a manual update, when user not logged in', async () => {
    const app = await authedApp();
    await assertFails(app.functions.httpsCallable('manualBalance')({ uid: players.player.uid, accountId: 1 }))
      .then(unauthenticated);
  });
  it('should deny a manual balance, when user is not bank-admin', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await assertFails(app.functions.httpsCallable('manualBalance')({ uid: players.player.uid, accountId: 1 }))
      .then(permissionDenied);
  });

  it('should update manual balance, when user is bank-admin', async () => {
    const app = await authedApp({ uid: collections.players.bankadmin.uid });
    await assertSucceeds(app.functions.httpsCallable('manualBalance')({ uid: players.player.uid, balance: 111 }))
      .then(async () => {
        const t = await readPlayer(players.player.uid);
        expect(t!.balance).toBe(111);
      });
    });
});