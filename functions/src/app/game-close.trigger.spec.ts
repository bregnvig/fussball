import { Game, Table, tableURL } from "../lib";
import { collections } from "../test-utils";
import { adminApp } from "../test-utils/firestore-test-utils";

describe.skip('Button request test', () => {

  let adminFirestore: firebase.firestore.Firestore;

  const readTable = async (id: string = '1'): Promise<Table> => adminFirestore.doc(tableURL(id)).get().then(snapshot => snapshot.data() as Table);
  const readPlayed = async (id: string = '1'): Promise<Game[]> => adminFirestore.collection(`${tableURL(id)}/played`).get().then(snapshot => snapshot.docs.map(d => d.data()) as Game[]);

  beforeEach(async () => {
    adminFirestore = adminApp();
    await adminFirestore.doc(tableURL('1')).set({ game: { ...collections.games.noMatches } });
  });

  it('should', async () => {
    const table = await readTable();
    table.game.state = 'completed';
    await adminFirestore.doc(tableURL('1')).set(table);
    const played = await readPlayed();
    expect(played).toHaveLength(1);
  });
});