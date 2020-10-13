import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { tableURL } from '../lib';
import { switchPosition } from '../lib/switch.service';
import { converter } from '../lib/timestamp.converter';
import { Table } from './../../../libs/data/src/lib/model/table.model';
import { Position } from './../lib/model/game.model';

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
  }
  switch (operation) {
    case 'switch':
      table.game.latestPosition = switchPosition(position, table.game.latestPosition);
      break;
    default: {
      console.log(`Operation ${operation} is not supported`);
      res.status(409).send(`Operation ${operation} is not supported`);
      return;
    }
  }
});
