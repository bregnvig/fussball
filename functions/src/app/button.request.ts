import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { allPositions, Position, Table, tableURL } from '../lib';
import { switchPosition } from '../lib/switch.service';
import { converter } from '../lib/timestamp.converter';
import { firestoreUtils } from './../lib/firestore-utils';
import { goal } from './../lib/goal.service';

type Operation = 'goal' | 'switch' | 'ownGoal';

export const buttonRequest = functions.region('europe-west1').https.onRequest(async (req: functions.Request, res: functions.Response) => {
  if (req.method !== 'POST') {
    res.sendStatus(403);
    return;
  }

  const tableId: string = req.query['id'] as string;
  const operation: Operation = req.query['operation'] as Operation;
  const position: Position = req.query['position'] as Position;

  const db = admin.firestore();

  const table: Table = await db.doc(tableURL(tableId))
    .withConverter(converter)
    .get()
    .then(snap => snap.data() as Table);

  const isPreparing = table?.game.state === 'preparing';
  const isAllPositionsTaken = allPositions.every(p => table?.game.latestPosition[p]);
  if(isPreparing && isAllPositionsTaken) {
    table.game.state = 'ongoing';
  }

  if (table?.game.state !== 'ongoing') {
    res.status(409).send('Game not ongoing');
    return;
  }
  switch (operation) {
    case 'switch':
      table.game.latestPosition = switchPosition(position, table.game.latestPosition);
      break;
    case 'goal':
      table.game = goal(position, table.game);
      break;
    case 'ownGoal':
      table.game = goal(position, table.game, true);
      break;
    default: {
      console.log(`Operation ${operation} is not supported`);
      res.status(409).send(`Operation ${operation} is not supported`);
      return;
    }
  }
  await db.doc(tableURL(tableId)).update({ game: firestoreUtils.convertDateTimes(table.game) });
  res.sendStatus(204);
});
