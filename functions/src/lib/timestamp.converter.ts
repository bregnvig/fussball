import { firestoreUtils } from './firestore-utils';
import {firestore} from 'firebase-admin'

export const converter = {
  toFirestore<T>(data: T): firestore.DocumentData {
    return firestoreUtils.convertDateTimes(data);
  },
  fromFirestore<T>(
    data: firestore.QueryDocumentSnapshot,
  ): T {
    return firestoreUtils.convertTimestamps(data);
  }
};
