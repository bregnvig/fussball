export * from './model';
export * from './auth.service';
export * from './auth.model';
export * from './race.service';
export * from './season.service';
export * from './timestamp.converter';
export * from './firestore-utils';
export * from './user.service';
export * from './collection-names';
export * from './transactions.service';
export * from './result.service';
export * from './mail.service';
export * from './message.service';
export * from './reminder.service';


import { converter as playerConverter } from './auth.converter';
import { converter as timestampConverter } from './timestamp.converter';

export const converter = {
  player: playerConverter,
  timestamp: timestampConverter
}
