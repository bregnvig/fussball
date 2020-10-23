import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Game, Player, Team } from '../lib';
import { playerURL, tableURL, teamURL } from './../lib/collection-names';
import { Table } from './../lib/model/table.model';

const getTeam = (id: string, player1: Player, player2: Player): Team => ({ id, players: [player1.uid, player2.uid], name: `${player1.displayName} & ${player2.displayName}` });

const createTeam = async (tableId: string, game: Game, teamNo: 'team1' | 'team2', teamId: string) => {
  const tableRef = admin.firestore().doc(tableURL(tableId));
  
  const teamRef = admin.firestore().doc(teamURL(teamId));
  const player1Ref = admin.firestore().doc(playerURL(game[teamNo].players[0]));
  const player2Ref = admin.firestore().doc(playerURL(game[teamNo].players[1]));

  await admin.firestore().runTransaction(transaction => {
    return transaction.getAll(tableRef, teamRef, player1Ref, player2Ref)
      .then(([tableDoc, teamDoc, player1Doc, player2Doc]) => {
        const table = tableDoc.data() as Table;
        const player1 = player1Doc.data() as Player;
        const player2 = player2Doc.data() as Player;

        const team: Team = getTeam(teamId, player1, player2);

        if (!teamDoc.exists) {
          transaction.create(teamRef, team);
        }
        transaction.set(tableRef, { ...table, game: { ...table.game, [teamNo]: teamDoc.exists ? teamDoc.data() as Team : team } });
      });
  });

};

const createTeams = async (tableId: string, game: Game): Promise<void> => {
  const team1Id: string | undefined = game?.team1?.id;
  if (team1Id) {
    await createTeam(tableId, game, 'team1', team1Id);
  }

  const team2Id: string | undefined = game?.team2?.id;
  if (team2Id) {
    await createTeam(tableId, game, 'team2', team2Id);
  }
};

export const createGameTrigger = functions.region('europe-west1').firestore.document('tables/{tableId}')
  .onUpdate(async (change, context) => {
    const tableId = context.params['tableId'];
    const before: Table = change.before.data() as Table;
    const after: Table = change.after.data() as Table;

    if (before.game?.state === 'preparing' && after.game?.state === 'preparing') {
      await createTeams(tableId, after.game);
    }
  });    