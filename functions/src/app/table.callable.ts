import { firestore } from 'firebase-admin';
import { https, region } from 'firebase-functions';
import { tableURL } from '../lib';
import { getUid } from '../lib/functions-utils';
import { isPosition, Position, Table } from '../lib/model';

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

async function joinTable(uid: string, data: TableRequestData): Promise<void> {
    const tableRef = firestore().doc(tableURL(data.tableId));
    return firestore().runTransaction(transaction => {
        return transaction.get(tableRef).then(tableDoc => {
            const table = tableDoc.data() as Table;
            const game = table.game;
            const state = game.state;

            const gameOngoing = state === 'ongoing';
            const preparing = state === 'preparing';
            const full = game.latestPosition && Object.keys(game.latestPosition).every(position => !!game.latestPosition[position as Position]);

            if([gameOngoing, preparing && full].some(x => !!x)) {
                throw new https.HttpsError('failed-precondition', 'A game is already being played on this table')
            }
            if(state === 'preparing' && game.latestPosition[data.position]) {
                throw new https.HttpsError('failed-precondition', `Position '${data.position}' is already taken`)
            }

        })
    })
}

export const tableCallable = region('europe-west1').https.onCall( async (data: TableRequestData, context: https.CallableContext) => {
    
    const uid = getUid(context);
    validateData(data);

    await joinTable(uid, data);

});