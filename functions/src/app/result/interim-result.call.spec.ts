import { assertFails, assertSucceeds } from '@firebase/testing';
import { playersURL, seasonsURL } from '../../lib/collection-names';
import { collections } from '../../test-utils';
import { adminApp, authedApp, clearFirestoreData, failedPrecondition, notFound, permissionDenied, unauthenticated } from '../../test-utils/firestore-test-utils';
import { SelectedTeamValue, Bid } from './../../lib/model/bid.model';
import { Player } from '../../lib/model';

const clone = require('clone');

describe('Submit interim result unittest', () => {

  let adminFirestore: firebase.firestore.Firestore;

  const writeBid = async (bid: any, uid: string) => adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${uid}`).set(bid);
  const readBid = async (uid: string): Promise<Bid> => adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}/bids/${uid}`).get().then(ref => ref.data() as Bid);

  beforeEach(async () => {
    adminFirestore = adminApp();
    await adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).set({ ...collections.players.admin });
    await adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).set({ ...collections.players.player });
    await adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).set({ ...collections.players.bookie });

    await adminFirestore.doc(`${seasonsURL}/9999`).set(collections.seasons[0]);
    await adminFirestore.doc(`${seasonsURL}/9999/teams/${collections.teams[0].constructorId}`).set(collections.teams[0]);
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set({ ...collections.races[1], state: 'closed', selectedTeam: collections.teams[0] });
  });

  afterEach(async () => {
    await clearFirestoreData();
  });

  it('should deny a interim submit result, when user not logged in', async () => {
    const app = await authedApp();
    await assertFails(app.functions.httpsCallable('submitInterimResult')())
      .then(unauthenticated);
  });
  it('should deny a submit result, when user but not know', async () => {
    const app = await authedApp({ uid: 'jckS2Q0' });
    await assertFails(app.functions.httpsCallable('submitInterimResult')())
      .then(notFound);
  });

  it('should deny a submit result, when the user is not an admin', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await assertFails(app.functions.httpsCallable('submitInterimResult')())
      .then(permissionDenied);
  });

  it('should deny a submit result, when result is invalid', async () => {
    const app = await authedApp({ uid: collections.players.admin.uid });

    await assertFails(app.functions.httpsCallable('submitInterimResult')()).then(failedPrecondition);

    let result = clone(collections.interimResults[0]);
    result.qualify[1] = result.qualify[0];
    await assertFails(app.functions.httpsCallable('submitInterimResult')(result)).then(failedPrecondition);
    result = clone(collections.interimResults[0]);
    result.qualify.push('vettel');
    await assertFails(app.functions.httpsCallable('submitInterimResult')(result)).then(failedPrecondition);
    result = clone(collections.interimResults[0]);
    result.qualify.length = 6;
    await assertFails(app.functions.httpsCallable('submitInterimResult')(result)).then(failedPrecondition);

    result = clone(collections.interimResults[0]);
    result.selectedDriver.grid = 0;
    await assertFails(app.functions.httpsCallable('submitInterimResult')(result)).then(failedPrecondition);
    result = clone(collections.interimResults[0]);
    result.selectedDriver.grid = collections.races[1].drivers!.length + 1;
    await assertFails(app.functions.httpsCallable('submitInterimResult')(result)).then(failedPrecondition);

    result = clone(collections.interimResults[0]);
    result.selectedTeam = {} as SelectedTeamValue;
    await assertFails(app.functions.httpsCallable('submitInterimResult')(result)).then(failedPrecondition);
    result.selectedTeam = { qualify: '', result: '' } as SelectedTeamValue;
    await assertFails(app.functions.httpsCallable('submitInterimResult')(result)).then(failedPrecondition);
    result.selectedTeam = { qualify: 'hamilton' } as SelectedTeamValue;
    await assertFails(app.functions.httpsCallable('submitInterimResult')(result)).then(failedPrecondition);
  });

  it('should reject interim result, when it cannot find a closed race', async () => {
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set({ ...collections.races[1], state: 'open' });
    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertFails(app.functions.httpsCallable('submitInterimResult')(collections.interimResults[0]))
      .then(notFound);

    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set({ ...collections.races[1], state: 'completed' });
    await assertFails(app.functions.httpsCallable('submitInterimResult')(collections.interimResults[0]))
      .then(notFound);

    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set({ ...collections.races[1], state: 'waiting' });
    await assertFails(app.functions.httpsCallable('submitInterimResult')(collections.interimResults[0]))
      .then(notFound);

  });

  it('should accept submitting of result, when result is valid but there are no bids', async () => {
    // Non completed bids
    await writeBid(collections.bids[0], collections.players.admin.uid);
    await writeBid(collections.bids[1], collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitInterimResult')(collections.interimResults[0]))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(40));
  });

  it('should accept submitting of result, when result is valid', async () => {

    await writeBid({ ...clone(collections.bids[0]), selectedTeam: { qualify: 'raikkonen' }, submitted: true }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), selectedTeam: { qualify: 'giovinazzi' }, submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitInterimResult')(collections.interimResults[0]))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(100))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(200))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(40))
      .then(() => readBid(collections.players.admin.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(12 + 3 + 1))
      .then(() => readBid(collections.players.player.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(3 + 2 + 0));
  });


  it('should accept submitting of result, when result is valid, Michael is in the lead', async () => {
    await writeBid({ ...clone(collections.bids[0]), selectedTeam: { qualify: 'raikkonen' }, submitted: true }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), selectedTeam: { qualify: 'giovinazzi' }, submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitInterimResult')(collections.interimResults[1]))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(100))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(200))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(40))
      .then(() => readBid(collections.players.player.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(12 + 3 + 1))
      .then(() => readBid(collections.players.admin.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(2 + 2 + 0));
  });

  it('should only include bids that have been submitted', async () => {
    await writeBid({ ...clone(collections.bids[0]), selectedTeam: { qualify: 'raikkonen' } }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), selectedTeam: { qualify: 'raikkonen' }, submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitInterimResult')(collections.interimResults[1]))
      .then(() => readBid(collections.players.player.uid))
      .then((bid: Bid) => expect(bid.points).toBeDefined())
      .then(() => readBid(collections.players.admin.uid))
      .then((bid: Bid) => expect(bid.points).toBeUndefined());

  });
});
