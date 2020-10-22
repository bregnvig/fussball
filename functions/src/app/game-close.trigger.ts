import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { playedURL, tableURL, teamURL } from './../lib/collection-names';
import { Table } from './../lib/model/table.model';


const createTeams = async (table: Table): Promise<void> => {
  const tableRef = admin.firestore().doc(tableURL(table.id));
  const team1Ref = table.game?.team1?.id ? admin.firestore().doc(teamURL(table.game.team1.id)) : null;
  const team2Ref = table.game?.team2?.id ? admin.firestore().doc(teamURL(table.game.team2.id)) : null;

  const transactions = [];
  if (team1Ref) {
    transactions.push(
      admin.firestore().runTransaction(transaction => {
        return transaction.getAll(team1Ref, tableRef).then(([team1Doc, tableDoc]) => {
          if(!team1Doc.exists) {
            const team: Team = {...table.game.team1, name: `${table.game.team1.name} & ${}` }
            transaction.create(team1Ref, team);
          }
          return;
        });
      })
    );
  }




  table.game.team1;
};

export const gameCloseTrigger = functions.region('europe-west1').firestore.document('tables/{tableId}')
  .onUpdate(async (change, context) => {
    const before: Table = change.before.data() as Table;
    const after: Table = change.after.data() as Table;
    if (before.game?.state !== 'completed' && after.game?.state === 'completed') {
      const db = admin.firestore();
      await db.collection(playedURL(change.after.id)).doc().set(after.game);
    }
    if (before.game?.state === 'preparing' && after.game?.state === 'ongoing') {
      await createTeams(after);
    }

    return null;
  });    