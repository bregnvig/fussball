import { firestore } from 'firebase-admin';
import { https, region } from 'firebase-functions';
import { tableURL } from '../lib';
import { getUid } from '../lib/functions-utils';
import { GameState, isPosition, Position, Table } from '../lib/model';

interface TableRequestData {
    action: 'join';
    tableId: string;
    position: Position;
}

function validateData(data: TableRequestData): void {
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

const joinGame = (table: Table, data: TableRequestData, uid: string): Table => {
    const game = table.game;
    const isFullGame = game.latestPosition && Object.keys(game.latestPosition).every(position => !!game.latestPosition[position as Position]);
    if (isFullGame) {
        throw new https.HttpsError('failed-precondition', 'Game is full');
    }

    const isPositionTaken = !!game.latestPosition[data.position];
    if (isPositionTaken) {
        throw new https.HttpsError('failed-precondition', `Position '${data.position}' is already taken`);
    }

    return { ...table, game: { ...game, latestPosition: { ...game.latestPosition, [data.position]: uid } } };
};

const defaultNumberOfMatches = 3;
const createGame = (table: Table, data: TableRequestData, uid: string): Table => {
    return {
        ...table,
        game: {
            latestPosition: { [data.position]: uid },
            matches: [],
            numberOfMatches: defaultNumberOfMatches,
            state: 'preparing',
        }
    };
};

async function joinTable(uid: string, data: TableRequestData): Promise<void> {
    const tableRef = firestore().doc(tableURL(data.tableId));
    return firestore().runTransaction(transaction => {
        return transaction.get(tableRef).then(tableDoc => {
            const table = tableDoc.data() as Table;
            const game = table.game;
            const state = game.state;
            if (state === 'ongoing') {
                throw new https.HttpsError('failed-precondition', 'A game is already being played on this table');
            }

            if (state === 'preparing') {
                transaction.set(tableRef, joinGame(table, data, uid));
            }

            if ((<GameState[]>['completed', 'cancelled']).some(s => state)) {
                transaction.set(tableRef, createGame(table, data, uid));
            }
        });
    });
}

export const tableCallable = region('europe-west1').https.onCall(async (data: TableRequestData, context: https.CallableContext) => {
    const uid = getUid(context);
    validateData(data);

    await joinTable(uid, data);
});