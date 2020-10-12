import { assertSucceeds } from '@firebase/testing';
import { collections } from '../../test-utils';
import { adminApp, clearFirestoreData } from '../../test-utils/firestore-test-utils';
import { seasonsURL } from './../../lib/collection-names';
import { IRace } from './../../lib/model/race.model';

describe('Copy race drivers', () => {

    let adminFirestore: firebase.firestore.Firestore;
    let round1 : IRace;
    let round2 : IRace;

    const updateRace = async (race: IRace, body: Partial<IRace>): Promise<void> => adminFirestore.doc(`${seasonsURL}/9999/races/${race.round}`).update(body);
    const readRace = async (round: number): Promise<IRace> => adminFirestore.doc(`${seasonsURL}/9999/races/${round}`).get().then(ref => ref.data() as IRace);

    beforeEach(async () => {
        adminFirestore = adminApp();
        await adminFirestore.doc(`${seasonsURL}/9999`).set(collections.seasons[0]);
        round1 = <any> collections.races.find(r => r.round === 1);
        round2 = <any> collections.races.find(r => r.round === 2);
        await adminFirestore.doc(`${seasonsURL}/9999/races/${round1.round}`).set({ ...round1, state: 'closed' });
        await adminFirestore.doc(`${seasonsURL}/9999/races/${round2.round}`).set({ ...round2, state: 'waiting' });
    });

    afterEach(async () => {
        await clearFirestoreData();
    })

    it('completing non final race should open the next', async () => {
        await assertSucceeds(updateRace(round1, {state: 'completed'}))
            .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
            .then(() => readRace(round2.round))
            .then((race: IRace) => expect(race.state).toBe('open'))
            .catch((error: any) => fail(error))
    })    

    it('completing final race should not result in an error', async () => {
        await assertSucceeds(updateRace(round2, {state: 'waiting'}))
            .then(() => updateRace(round2, { state: 'completed' }))
            .then(() => new Promise(resolve => setTimeout(() => resolve(), 2000)))
            .catch((error: any) => fail(error))
    })    

});