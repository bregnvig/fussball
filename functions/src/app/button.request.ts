import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Position, Table, tableURL } from '../lib';
import { switchPosition } from '../lib/switch.service';
import { converter } from '../lib/timestamp.converter';
import { goal, ownGoal } from './../lib/goal.service';

type Operation = 'goal' | 'switch' | 'ownGoal';

export const performButton = functions.region('europe-west1').https.onRequest(async (req: functions.Request, res: functions.Response) => {
  if (req.method !== 'POST') {
    res.sendStatus(403);
    return;
  }

  const tableId: string = req.params['id'];
  const operation: Operation = req.params['operation'] as Operation;
  const position: Position = req.params['position'] as Position;

  const db = admin.firestore();

  const table: Table = await db.doc(tableURL(tableId))
    .withConverter(converter)
    .get()
    .then(snap => snap.data() as Table);

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
      table.game = ownGoal(position, table.game);
      break;
    default: {
      console.log(`Operation ${operation} is not supported`);
      res.status(409).send(`Operation ${operation} is not supported`);
      return;
    }
  }
  await db.doc(tableURL(tableId)).update({ game: table.game });
  res.sendStatus(200);
});
