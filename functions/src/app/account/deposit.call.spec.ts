import { retry } from './../../test-utils/firestore-test-utils';
import { assertFails, assertSucceeds } from '@firebase/testing';
import { Player } from '../../lib/model/player.model';
import { adminApp, authedApp, clearFirestoreData, failedPrecondition, notFound, permissionDenied, unauthenticated } from '../../test-utils/firestore-test-utils';
import { players } from '../../test-utils/players.collection';
import { playersURL } from './../../lib/collection-names';

describe('Deposit unittest', () => {

  let adminFirestore: firebase.firestore.Firestore;

  beforeEach(async () => {
    // depositFn = test.wrap(deposit);
    adminFirestore = adminApp();
    await adminFirestore.doc(`${playersURL}/${players.player.uid}`).set({ ...players.player });
    await adminFirestore.doc(`${playersURL}/${players.admin.uid}`).set({ ...players.admin });

  });

  afterEach(async () => {
    await clearFirestoreData();
  });

  it('should deny a deposit, when user not logged in', async () => {
    const app = await authedApp();
    await assertFails(app.functions.httpsCallable('deposit')({ amount: 100, message: 'Hello' }))
      .then(unauthenticated);
  });

  it('should deny a deposit, when user but not know', async () => {
    const app = await authedApp({ uid: 'jckS2Q0' });
    await assertFails(app.functions.httpsCallable('deposit')({ amount: 100, message: 'Hello' }))
      .then(notFound);
  });


  it('should deny a deposit, when the amount is not specified or zero', async () => {
    const app = await authedApp({ uid: players.admin.uid });
    await assertFails(app.functions.httpsCallable('deposit')({ amount: 0, message: 'Hello', uid: players.player.uid }))
      .then(failedPrecondition);
  });

  it('should deny a deposit, when the amount is negative', async () => {
    const app = await authedApp({ uid: players.admin.uid });
    await assertFails(app.functions.httpsCallable('deposit')({ amount: -100, message: 'Hello', uid: players.player.uid }))
      .then(failedPrecondition);
  });

  it('should deny a deposit, when the user does not have the role of bank-admin', async () => {
    const app = await authedApp({ uid: players.player.uid });
    await assertFails(app.functions.httpsCallable('deposit')({ amount: 100, message: 'Hello', uid: players.player.uid }))
      .then(permissionDenied);
  });

  it('should accept a deposit', async () => {
    const app = await authedApp({ uid: players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('deposit')({ amount: 100, message: 'Hello', uid: players.player.uid }))
      .then(() => retry(() => adminFirestore.doc(`${playersURL}/${players.player.uid}`).get().then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data()! as Player),
        (p: Player) => p && p.balance === 300)
      );
  });
});

