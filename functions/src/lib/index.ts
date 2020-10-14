export * from './collection-names';
export * from './firestore-utils';
export * from './model';
export * from './timestamp.converter';


import { converter as timestampConverter } from './timestamp.converter';

export const converter = {
  timestamp: timestampConverter
};
