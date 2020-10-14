import * as myFunctions from '../../src/';
import { Table } from '../lib';
import { collections } from '../test-utils';
import { adminApp, authedApp } from '../test-utils/firestore-test-utils';
import { tableURL } from './../lib/collection-names';

describe.skip('Button request test', () => {

  let adminFirestore: firebase.firestore.Firestore;

  const readTable = async (id: string = '1'): Promise<Table> => adminFirestore.doc(tableURL(id)).get().then(snapshot => snapshot.data() as Table);

  beforeEach(async () => {
    authedApp();
    adminFirestore = adminApp();
    await adminFirestore.doc(tableURL('1')).set({ game: { ...collections.games.noMatches } });
  });

  it('should reject non post', () => {
    const res = {
      sendStatus: jest.fn()
    };
    const req = {
    };
    myFunctions.buttonRequest(req as any, res as any);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('should reject non ongoing games', async () => {

    await adminFirestore.doc(tableURL('1')).set({ game: { ...collections.games.noMatches, state: 'preparing' } });
    const table = await readTable();
    console.log('FFDFSDFSDFSDFD', table);
    const res = {
      status: jest.fn()
    };
    const req = {
      method: 'POST',
      query: {
        id: '1',
        operation: 'goal',
        position: 'redDefence'
      }
    };
    await myFunctions.buttonRequest(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(409);

  });
});