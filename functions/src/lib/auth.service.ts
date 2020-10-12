import { converter } from './auth.converter';
import { PlayerImpl } from './auth.model';
import * as admin from 'firebase-admin';
import { playersURL } from './collection-names';

export const getUser = async (uid: string): Promise<PlayerImpl | undefined> => {
  return admin.firestore().doc(`${playersURL}/${uid}`).withConverter(converter).get().then(ref => ref.data());
}
