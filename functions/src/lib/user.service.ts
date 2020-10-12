import * as admin from 'firebase-admin';
import { converter } from './auth.converter';
import { PlayerImpl } from './auth.model';
import { getUser } from './auth.service';
import { logAndCreateError } from './firestore-utils';
import { Role } from './model/player.model';
import { playersURL } from './collection-names';

export const validateAccess = async (uid: string | undefined, ...role: Role[]): Promise<PlayerImpl> => {
  if (uid) {
    const player: PlayerImpl | undefined = await getUser(uid);

    if (!player) {
      throw logAndCreateError('not-found', `${uid} tried to login. No user with specified uid exists`);
    }
    
    if (!player.isInRole(...role)) {
      throw logAndCreateError('permission-denied', `${player.displayName} does not have sufficient permissions. Role '${role.join(',')}' required. Has ${player.roles.join(', ')} `)
    }
    return player;
  }
  throw logAndCreateError('unauthenticated', `No user was apparently logged in`);
}


let _bookie: Promise<PlayerImpl> | null = null;

export const getBookie = (): Promise<PlayerImpl> => {
  if (_bookie) {
    return _bookie;
  }
  _bookie = admin.firestore().collection(playersURL)
    .where('roles', 'array-contains', 'bookie')
    .withConverter(converter)
    .get()
    .then(({docs}) => {
      if (docs.length === 1) {
         return docs[0].data()
      }
      if (!docs.length) {
        throw logAndCreateError('not-found', 'No bookie was found');
      }
      throw logAndCreateError('internal', `${docs.length} bookies exists. Only one bookie allowed`);
    });
  return _bookie;
}

