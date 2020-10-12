import { assertFails, assertSucceeds } from '@firebase/testing';
import { DateTime } from 'luxon';
import { playersURL, seasonsURL } from '../../lib/collection-names';
import { collections } from '../../test-utils';
import { adminApp, authedApp, failedPrecondition, notFound, unauthenticated, clearFirestoreData } from '../../test-utils/firestore-test-utils';
import { Player } from '../../lib/model';

const clone = require('clone');

describe('Join WBC unittest', () => {

  let adminFirestore: firebase.firestore.Firestore;
  
  beforeEach(async () => {
    adminFirestore = adminApp();
    await adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).set(clone(collections.players.player));
    await adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).set(clone(collections.players.admin));
    await adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).set(clone(collections.players.bookie));

    await adminFirestore.doc(`${seasonsURL}/9999`).set({
      ...clone(collections.seasons[0]), wbc: {
        latestWBCJoinDate: DateTime.local().plus({ day: 1 }).toJSDate()
      }
    });
  });

  afterEach(async () => {
    await clearFirestoreData();
  });

  it('should deny a join request, when user not logged in', async () => {
    const app = await authedApp();
    await assertFails(app.functions.httpsCallable('joinWBC')())
      .then(unauthenticated);
  });
  it('should deny a join WBC, when user but not know', async () => {
    const app = await authedApp({ uid: 'jckS2Q0' });
    await assertFails(app.functions.httpsCallable('joinWBC')())
      .then(notFound);
  });

  it('should deny a join WBC, when the user has already joined', async () => {
    const app = await authedApp({ uid: collections.players.admin.uid });
    await adminFirestore.doc(`${seasonsURL}/9999`).update({ wbc: { participants: [collections.players.admin.uid] } });
    await assertFails(app.functions.httpsCallable('joinWBC')())
      .then(failedPrecondition);
  });

  it('should deny join WBC, if the user does not have enough money', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).update({ balance: -100 });
    await assertFails(app.functions.httpsCallable('joinWBC')()).then(failedPrecondition);
  });

  it('should deny join WBC, if is too late', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await adminFirestore.doc(`${seasonsURL}/9999`).update({ wbc: { latestWBCJoinDate: DateTime.local().minus({ day: 1 }).toJSDate() } });
    await assertFails(app.functions.httpsCallable('joinWBC')()).then(failedPrecondition);
  });

  it('should accept joining WBC, when everything is alright', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await adminFirestore.doc(`${seasonsURL}/9999`).update({ wbc: { latestWBCJoinDate: DateTime.local().plus({ day: 1 }).toJSDate() } });
    await assertSucceeds(app.functions.httpsCallable('joinWBC')())
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(100));
  });
});

