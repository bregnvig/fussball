import { firestore } from 'firebase-admin';
import { PlayerImpl } from './auth.model';
// import { firestoreUtils } from '@fussball/data';
import { firestoreUtils } from './firestore-utils';

export const converter = {
  toFirestore(player: PlayerImpl): firestore.DocumentData {
    return firestoreUtils.convertDateTimes(player);
  },
  fromFirestore(
    data: firestore.QueryDocumentSnapshot,
  ): PlayerImpl {
    return new PlayerImpl(firestoreUtils.convertTimestamps(data));
  }
};
