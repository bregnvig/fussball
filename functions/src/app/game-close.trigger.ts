import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { playedURL, playerURL, teamURL } from './../lib/collection-names';
import { Table } from './../lib/model/table.model';

/**
 * 
 * @param table 
 * @param team 
 * @returns null if team consists of one uid only
 */
const getTeamOrPlayerRef = (table: Table, team: 'team1' | 'team2'): admin.firestore.DocumentReference | null => {
  const uids = Array.from(new Set<string>(table.game[team].players)).sort();
  return uids.length > 1 ? admin.firestore().doc(teamURL(`${uids[0]}_${uids[1]}`)) : null;
};

const getPlayerRef = (table: Table, team: 'team1' | 'team2'): admin.firestore.DocumentReference => {
  return admin.firestore().doc(playerURL(table.game[team].players[0]))
};

const createTeams = async (table: Table): Promise<any> => {
  const team1Ref = getTeamRef(table, 'team1') || ;
  const team2Ref = getTeamRef(table, 'team2');
  return admin.firestore().runTransaction(transaction => {
    return transaction.getAll(team1Ref).then(() => {

    });
  });
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