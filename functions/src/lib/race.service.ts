import * as admin from 'firebase-admin';
import { currentSeason, converter } from './';
import { racesURL, seasonsURL } from './collection-names';
import { IRace } from "./model";
const currentRaceURL = (seasonId: string | number) => `${seasonsURL}/${seasonId}/${racesURL}`;

export const getCurrentRace = async (state: 'open' | 'closed'): Promise<IRace | undefined> => {
  return currentSeason().then(season => admin.firestore()
    .collection(currentRaceURL(season.id!))
    .where('state', '==', state)
    .withConverter<IRace>(converter.timestamp)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length === 1) {
        return snapshot.docs[0].data();
      } else if (snapshot.docs.length > 1) {
        return Promise.reject(`Found ${snapshot.docs.length} with state open`);
      }
      return undefined;
    }));
};

export const updateRace = async (seasonId: number, round: number, race: Partial<IRace>): Promise<admin.firestore.WriteResult> => {
  console.log(`Updating race season/${seasonId}/races/${round}`, race);
  return admin.firestore()
    .doc(`${currentRaceURL(seasonId)}/${round}`)
    .update(race);
};
