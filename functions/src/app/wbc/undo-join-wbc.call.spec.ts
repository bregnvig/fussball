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
        latestWBCJoinDate: DateTime.local().plus({ day: 1 }).toJSDate(),
        participants: [collections.players.player.uid]
      }
    });
  });

  afterEach(async () => {
    await clearFirestoreData();
  });

  it('should deny a undo request, when user not logged in', async () => {
    const app = await authedApp();
    await assertFails(app.functions.httpsCallable('undoWBC')())
      .then(unauthenticated);
  });
  it('should deny a undo WBC, when user but not know', async () => {
    const app = await authedApp({ uid: 'jckS2Q0' });
    await assertFails(app.functions.httpsCallable('undoWBC')())
      .then(notFound);
  });

  it('should deny a undo WBC, when the user has never joined', async () => {
    const app = await authedApp({ uid: collections.players.admin.uid });
    await adminFirestore.doc(`${seasonsURL}/9999`).update({ wbc: { participants: [] } });
    await assertFails(app.functions.httpsCallable('undoWBC')())
      .then(failedPrecondition);
  });

  it('should deny undo WBC, if is too late', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await adminFirestore.doc(`${seasonsURL}/9999`).update({ wbc: { latestWBCJoinDate: DateTime.local().minus({ day: 1 }).toJSDate() } });
    await assertFails(app.functions.httpsCallable('undoWBC')()).then(failedPrecondition);
  });

  it('should accept undoing WBC, when everything is alright', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await assertSucceeds(app.functions.httpsCallable('undoWBC')())
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(300));
  });
});

