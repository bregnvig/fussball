import * as functions from 'firebase-functions';
import { Bid, currentSeason, getCurrentRace, internalError, logAndCreateError, racesURL, seasonsURL, validateAccess, Player, IRace, sendMail, sendMessage } from '../../lib';
import { calculateInterimResult } from './../../lib/result.service';
import { validateInterimResult } from './../../lib/validate.service';
import admin = require('firebase-admin');

const mailBody = (player: Player, race: IRace, results: Partial<Bid>[]): string => {
  const lis = results.map(r => `<li>${r.player?.displayName}: ${r.points} point</li>`);
  return `<h3>Hej ${player.displayName}</h3>
     <div> 
     <p> Mellemresultatet for ${race.name} er klart</p>
     <p>
        Indtil videre ser det ca. sådan her ud
        <ul>
          ${lis}
        </ul>
     </p>
     </div>     
                  
     Wroouumm,<br/>
     F1emming`;
};

const messageBody = (player: Player, results: Partial<Bid>[]): string => {
  const index = results.findIndex(r => r.player?.uid === player.uid);
  return `Og du ligger på en foreløbig ${index + 1}. plads!`;
};

export const submitInterimResult = functions.region('europe-west1').https.onCall(async (data: Partial<Bid>, context) => {
  return validateAccess(context.auth?.uid, 'admin')
    .then(player => buildResult(data))
    .then(() => true)
    .catch(internalError);
});

const buildResult = async (result: Partial<Bid>) => {
  const season = await currentSeason();
  const race = await getCurrentRace('closed');

  if (!season || !race) {
    throw logAndCreateError('not-found', 'Season or race', season?.name, race?.name);
  }

  validateInterimResult(result, race);

  const db = admin.firestore();
  const calculatedResults: Partial<Bid>[] = await db.collection(`${seasonsURL}/${race.season}/${racesURL}/${race.round}/bids`).where('submitted', '==', true).get()
    .then(snapshot => snapshot.docs)
    .then(snapshots => snapshots.map(s => s.data()))
    .then(bids => bids.map(bid => calculateInterimResult(bid as Bid, result)))
    .then(bids => bids.sort((a, b) => b.points! - a.points!));

  return db.runTransaction(transaction => {
    calculatedResults.forEach(cr => {
      transaction.set(db.doc(`${seasonsURL}/${race.season}/${racesURL}/${race.round}/bids/${cr.player!.uid}`), cr);
    });
    transaction.update(db.doc(`${seasonsURL}/${race.season}/${racesURL}/${race.round}`), { result });
    return Promise.resolve(`Interim result submitted`);
  }).then(() => {
    const players = calculatedResults.map(cr => cr.player!);
    return Promise.all(players.map(player => {
      console.log(`Should mail to ${player.displayName}`);
      const results = [sendMail(player.email, `Så er der mellemresultat for ${race.name}`, mailBody(player, race, calculatedResults))];
      if (player.tokens && player.tokens.length) {
        console.log(`Should send message to ${player.displayName}`);
        results.push(sendMessage(player.tokens, `Mellemresultat for ${race.name}`, messageBody(player, calculatedResults)).then(() => 'OK'));
      }
    }));
  });
};
