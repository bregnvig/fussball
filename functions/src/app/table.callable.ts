import { auth, firestore } from 'firebase-admin';
import { https, region } from 'firebase-functions';
import { playerURL, tableURL } from '../lib';
import { getUid } from '../lib/functions-utils';
import { allPositions, Game, GamePlayer, isPosition, JoinTableData, Player, Position, Table } from '../lib/model';

function validateData(data: JoinTableData): void {
  if (data.action !== 'join') {
    throw new https.HttpsError('invalid-argument', `action has to be 'join'`);
  }
  if (!data.tableId) {
    throw new https.HttpsError('invalid-argument', 'tableId not set');
  }
  if (isPosition(data.position) === false) {
    throw new https.HttpsError('invalid-argument', `position has to be 'redDefence' | 'redOffence' | 'blueDefence' | 'blueOffence'`);
  }
}

const getTeamMatePosition = (data: JoinTableData): Position => `${data.position.includes('blue') ? 'blue' : 'red'}${data.position.includes('Offence') ? 'Defence' : 'Offence'}` as Position;

const getTeamId = (game: Game, teamMatePosition: Position): 'team1' | 'team2' => {
  const teamMateUid: string | undefined = game.latestPosition[teamMatePosition];
  if (teamMateUid) {
    return game.team1.players.some(player => player === game.latestPosition[teamMatePosition]) ? 'team1' : 'team2';
  }
  return game.team1.players.length ? 'team2' : 'team1';
};

const getGamePlayer = async (uid: string): Promise<GamePlayer> => {
  const { displayName, photoURL } = await auth().getUser(uid);
  if (displayName && photoURL) {
    return { displayName, photoURL };
  }
  const dbUser = (await firestore().doc(playerURL(uid)).get()).data() as Player;
  return { displayName: dbUser.displayName, photoURL: dbUser.photoURL };
};

const joinGame = (table: Table, data: JoinTableData, uid: string, player: GamePlayer): Table => {
  const game = table.game;
  const isFullGame = game.latestPosition && allPositions.every(position => !!game.latestPosition[position]);
  if (isFullGame) {
    throw new https.HttpsError('failed-precondition', 'Game is full');
  }

  const isPositionTaken = !!game.latestPosition[data.position];
  if (isPositionTaken) {
    throw new https.HttpsError('failed-precondition', `Position '${data.position}' is already taken`);
  }

  const teamId = getTeamId(game, getTeamMatePosition(data));
  const team = Array.from(new Set([...game[teamId].players, uid]).values());

  return {
    ...table,
    game: {
      ...game,
      latestPosition: {
        ...game.latestPosition,
        [data.position]: uid,
      },
      [teamId]: team,
      players: {
        ...game.players,
        [uid]: player,
      }
    }
  };
};

const defaultNumberOfMatches = 3;
const createGame = (table: Table, data: JoinTableData, uid: string, player: GamePlayer): Table => {
  return {
    ...table,
    game: {
      latestPosition: { [data.position]: uid },
      matches: [],
      numberOfMatches: defaultNumberOfMatches,
      team1: {
        players: [uid]
      },
      team2: {
        players: []
      },
      state: 'preparing',
      players: {
        [uid]: player,
      }
    }
  };
};

async function joinTable(uid: string, data: JoinTableData, player: GamePlayer): Promise<void> {
  const tableRef = firestore().doc(tableURL(data.tableId));
  return firestore().runTransaction(transaction => {
    return transaction.get(tableRef).then(tableDoc => {
      const table = tableDoc.data() as Table;
      const game = table?.game;
      const state = game?.state;
      if (state === 'ongoing') {
        throw new https.HttpsError('failed-precondition', 'A game is already being played on this table');
      } else if (state === 'preparing') {
        transaction.set(tableRef, joinGame(table, data, uid, player));
      } else {
        transaction.set(tableRef, createGame(table, data, uid, player));
      }
    });
  });
}

export const tableCallable = region('europe-west1').https.onCall(async (data: JoinTableData, context: https.CallableContext) => {
  const uid = getUid(context);
  validateData(data);

  const gamePlayer = await getGamePlayer(uid);

  await joinTable(uid, data, gamePlayer);
});