import { IRace } from './../../lib/model/race.model';
import { assertFails, assertSucceeds } from '@firebase/testing';
import { playersURL, seasonsURL } from '../../lib/collection-names';
import { Player } from '../../lib/model';
import { collections } from '../../test-utils';
import { adminApp, authedApp, clearFirestoreData, failedPrecondition, notFound, permissionDenied, unauthenticated } from '../../test-utils/firestore-test-utils';
import { Bid, SelectedTeamValue } from './../../lib/model/bid.model';

const clone = require('clone');

describe('Submit result unittest', () => {

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
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set({ ...collections.races[1], state: 'closed' });
  });

  afterEach(async () => {
    await clearFirestoreData();
  });

  it('should deny a submit result, when user not logged in', async () => {
    const app = await authedApp();
    await assertFails(app.functions.httpsCallable('submitResult')())
      .then(unauthenticated);
  });
  it('should deny a submit result, when user but not know', async () => {
    const app = await authedApp({ uid: 'jckS2Q0' });
    await assertFails(app.functions.httpsCallable('submitResult')())
      .then(notFound);
  });

  it('should deny a submit result, when the user is not an admin', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await assertFails(app.functions.httpsCallable('submitResult')())
      .then(permissionDenied);
  });

  it('should deny a submit result, when result is invalid', async () => {
    const app = await authedApp({ uid: collections.players.admin.uid });

    await assertFails(app.functions.httpsCallable('submitResult')()).then(failedPrecondition);

    let result = clone(collections.results[0]);
    result.qualify[1] = result.qualify[0];
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.qualify.push('vettel');
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.qualify.length = 6;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);

    result = clone(collections.results[0]);
    result.podium[1] = result.podium[0];
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.podium.push('hamilton');
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.podium.length = 3;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);

    result = clone(collections.results[0]);
    result.fastestDriver.push('vettel');
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.fastestDriver.length = 1;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);

    result = clone(collections.results[0]);
    result.selectedDriver.grid = 0;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.selectedDriver.grid = collections.races[1].drivers!.length + 1;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.selectedDriver.finish = 0;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.selectedDriver.finish = collections.races[1].drivers!.length + 1;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.selectedDriver.finish = -1;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);

    result = clone(collections.results[0]);
    result.polePositionTime = -1;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.polePositionTime = 1000 * 60 * 2;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.polePositionTime = 1000 * 60;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);

    // Add team to race
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).update({ selectedTeam: collections.teams[0] });
    result = clone(collections.results[0]);
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result = clone(collections.results[0]);
    result.selectedTeam = {} as SelectedTeamValue;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result.selectedTeam = { qualify: '', result: '' } as SelectedTeamValue;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
    result.selectedTeam = { qualify: 'raikkonen', result: 'hamilton' } as SelectedTeamValue;
    await assertFails(app.functions.httpsCallable('submitResult')(result)).then(failedPrecondition);
  });

  it('should reject bid, when it cannot find a closed race', async () => {
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set({ ...collections.races[1], state: 'open' });
    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertFails(app.functions.httpsCallable('submitResult')(collections.results[0]))
      .then(notFound);

    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set({ ...collections.races[1], state: 'completed' });
    await assertFails(app.functions.httpsCallable('submitResult')(collections.results[0]))
      .then(notFound);

    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set({ ...collections.races[1], state: 'waiting' });
    await assertFails(app.functions.httpsCallable('submitResult')(collections.results[0]))
      .then(notFound);

  });

  it('should accept submitting of result, when result is valid but there are no bids', async () => {
    // Non completed bids
    await writeBid(collections.bids[0], collections.players.admin.uid);
    await writeBid(collections.bids[1], collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitResult')(collections.results[0]))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(40));
  });

  it('should accept submitting of result, when result is valid', async () => {
    await writeBid({ ...clone(collections.bids[0]), submitted: true }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitResult')(collections.results[0]))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(140))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(200))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(0))
      .then(() => readBid(collections.players.admin.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(12 + 2 + 6 + 3 + 3 + 3))
      .then(() => readBid(collections.players.player.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(3 + 0 + 1 + 2 + 0 + 1));
  });

  it('should accept submitting of result with team, when result is valid', async () => {
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).update({ selectedTeam: collections.teams[0] });
    await writeBid({ ...clone(collections.bids[0]), submitted: true, selectedTeam: { qualify: 'giovinazzi', result: 'giovinazzi' } }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), submitted: true, selectedTeam: { qualify: 'raikkonen', result: 'giovinazzi' } }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitResult')({ ...clone(collections.results[0]), selectedTeam: { qualify: 'giovinazzi', result: 'giovinazzi' } }))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(140))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(200))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(0))
      .then(() => readBid(collections.players.admin.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(12 + 2 + 6 + 3 + 3 + 3 + 2))
      .then(() => readBid(collections.players.player.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(3 + 0 + 1 + 2 + 0 + 1 + 1));
  });

  it('should accept submitting of result, when result is valid, Michael wins', async () => {
    await writeBid({ ...clone(collections.bids[0]), submitted: true }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitResult')(collections.results[1]))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(100))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(240))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(0))
      .then(() => readBid(collections.players.player.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(12 + 2 + 6 + 3 + 3 + 3))
      .then(() => readBid(collections.players.admin.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(2 + 1 + 1 + 2 + 0));
  });

  it('should accept submitting of result, with no first crashes', async () => {
    await writeBid({ ...clone(collections.bids[0]), submitted: true }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    const result = { ...clone(collections.results[0]), firstCrash: undefined };
    await assertSucceeds(app.functions.httpsCallable('submitResult')(result))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => readBid(collections.players.admin.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(12 + 2 + 6 + 3 + 3 + 0));
  });

  it('should accept submitting of result, with no first crashes', async () => {
    await writeBid({ ...clone(collections.bids[0]), submitted: true }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    const result = { ...clone(collections.results[0]), firstCrash: ['grojean'] };
    await assertSucceeds(app.functions.httpsCallable('submitResult')(result))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => readBid(collections.players.admin.uid))
      .then((bid: Bid) => expect(bid.points).toEqual(12 + 2 + 6 + 3 + 3 + 3));
  });

  it('should create a result property and state completed on the race document, when result is submitted', async () => {
    await writeBid({ ...clone(collections.bids[0]), submitted: true }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitResult')(collections.results[1]))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).get().then(ref => ref.data()))
      .then((race: IRace) => {
        expect(race.result).toBeTruthy();
        expect(race.result).toStrictEqual(collections.results[1]);
        expect(race.state).toBe('completed');
      });
  });

  it('should only include bids that have been submitted', async () => {
    await writeBid({ ...clone(collections.bids[0]) }, collections.players.admin.uid);
    await writeBid({ ...clone(collections.bids[1]), submitted: true }, collections.players.player.uid);

    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertSucceeds(app.functions.httpsCallable('submitResult')(collections.results[1]))
      .then(() => readBid(collections.players.player.uid))
      .then((bid: Bid) => expect(bid.points).toBeDefined())
      .then(() => readBid(collections.players.admin.uid))
      .then((bid: Bid) => expect(bid.points).toBeUndefined());

  });
});
