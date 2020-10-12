import { assertFails, assertSucceeds } from '@firebase/testing';
import { playersURL, seasonsURL } from '../../lib/collection-names';
import { Player } from '../../lib/model/player.model';
import { collections } from '../../test-utils';
import { adminApp, authedApp, clearFirestoreData, failedPrecondition, notFound, unauthenticated } from '../../test-utils/firestore-test-utils';
import { SelectedTeamValue } from './../../lib/model/bid.model';

const clone = require('clone');

describe('Submit bid unittest', () => {

  let adminFirestore: firebase.firestore.Firestore;

  beforeEach(async () => {
    adminFirestore = adminApp();
    await adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).set({ ...collections.players.player });
    await adminFirestore.doc(`${playersURL}/${collections.players.admin.uid}`).set({ ...collections.players.admin });
    await adminFirestore.doc(`${playersURL}/${collections.players.bookie.uid}`).set({ ...collections.players.bookie });

    await adminFirestore.doc(`${seasonsURL}/9999`).set(collections.seasons[0]);
    await adminFirestore.doc(`${seasonsURL}/9999/teams/${collections.teams[0].constructorId}`).set(collections.teams[0]);
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).set(collections.races[1]);
  });

  afterEach(async () => {
    await clearFirestoreData();
  });

  it('should deny a submit bid, when user not logged in', async () => {
    const app = await authedApp();
    await assertFails(app.functions.httpsCallable('submitBid')())
      .then(unauthenticated);
  });
  it('should deny a submit bid, when user but not know', async () => {
    const app = await authedApp({ uid: 'jckS2Q0' });
    await assertFails(app.functions.httpsCallable('submitBid')())
      .then(notFound);
  });


  it('should deny a submit bid, when the user has no bid', async () => {
    const app = await authedApp({ uid: collections.players.admin.uid });
    await assertFails(app.functions.httpsCallable('submitBid')())
      .then(notFound);
  });

  it('should deny a submit bid, when bid is invalid', async () => {
    const app = await authedApp({ uid: collections.players.admin.uid });

    let bid = clone(collections.bids[0]);
    bid.qualify[1] = bid.qualify[0];
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.qualify.push('hamilton');
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.qualify.length = 5;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);

    bid = clone(collections.bids[0]);
    bid.podium[1] = bid.podium[0];
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.podium.push('hamilton');
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.podium.length = 2;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);

    bid = clone(collections.bids[0]);
    bid.fastestDriver.push('hamilton');
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.fastestDriver.length = 0;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);

    bid = clone(collections.bids[0]);
    bid.firstCrash.push('hamilton');
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.firstCrash.length = 0;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);

    bid = clone(collections.bids[0]);
    bid.selectedDriver.grid = 0;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.selectedDriver.grid = collections.races[1].drivers!.length + 1;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.selectedDriver.finish = 0;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.selectedDriver.finish = collections.races[1].drivers!.length + 1;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.selectedDriver.finish = -1;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);

    bid = clone(collections.bids[0]);
    bid.polePositionTime = -1;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.polePositionTime = 1000 * 60 * 2;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.polePositionTime = 1000 * 60;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);

    // Add team to race
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).update({ selectedTeam: collections.teams[0] });
    bid = clone(collections.bids[0]);
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid = clone(collections.bids[0]);
    bid.selectedTeam = {} as SelectedTeamValue;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid.selectedTeam = { qualify: '', result: '' } as SelectedTeamValue;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);
    bid.selectedTeam = { qualify: 'raikkonen', result: 'hamilton' } as SelectedTeamValue;
    await assertFails(app.functions.httpsCallable('submitBid')(bid)).then(failedPrecondition);

  });

  it('should deny bid, if the user does not have enough money', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).update({ balance: -100 });
    await assertFails(app.functions.httpsCallable('submitBid')(clone(collections.bids[1]))).then(failedPrecondition);
  });

  it('should accept submitting of bid, when bid is valid', async () => {
    const app = await authedApp({ uid: collections.players.player.uid });
    await assertSucceeds(app.functions.httpsCallable('submitBid')(clone(collections.bids[1])))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(180));
  });

  it('should accept submitting of bid with teams, when bid is valid', async () => {
    await adminFirestore.doc(`${seasonsURL}/9999/races/${collections.races[1].round}`).update({ selectedTeam: collections.teams[0] });
    const app = await authedApp({ uid: collections.players.player.uid });
    const bid = clone(collections.bids[1]);
    bid.selectedTeam = ({ qualify: 'raikkonen', result: 'giovinazzi' }) as SelectedTeamValue;
    await assertSucceeds(app.functions.httpsCallable('submitBid')(bid))
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
      .then(() => adminFirestore.doc(`${playersURL}/${collections.players.player.uid}`).get())
      .then((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.data())
      .then((player: Player) => expect(player.balance).toEqual(180));
  });
});

