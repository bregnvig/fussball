import * as functions from 'firebase-functions';
import { sendMail, sendMessage, WBC, WBCResult } from '../../lib';

const mailbody = (playerName: any, wbcPoints: number, raceName: any) =>
  `<h3>Hej ${playerName}</h3>
     <div> 
      <p> ${raceName} er nu afgjort - du har fået ${wbcPoints} WBC points</p>
     </div>     
                  
     Wroouumm,<br/>
     F1emming`;

const messageBody = (raceName: string, wbcPoints: number) => `${raceName} er nu afgjort - du har fået ${wbcPoints} WBC points`;

export const resultNotificationTrigger = functions.region('europe-west1').firestore.document('seasons/{seasonId}')
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>, context: functions.EventContext) => {
    const before: WBC = change.before.data()?.wbc || [];
    const after: WBC = change.after.data()?.wbc || [];
    if ((after.results?.length && (before.results?.length ?? 0) < (after.results?.length ?? 0))) {
      const result: WBCResult = after.results[after.results.length - 1];
      console.log('Race', result.raceName, 'Is now completed- lets send a result mails');
      return Promise.all(result.players.map(element => {
        const sendWBCResult = (place: string) => {
          const notifications = [
            sendMail(element.player.email, place, mailbody(element.player.displayName, element.points, result.raceName)).then((msg) => {
              console.log(`Mail result :(${msg})`);
            })
          ];
          if (element.player.tokens?.length) {
            notifications.push(sendMessage(element.player.tokens, place, messageBody(result.raceName, element.points)).then((msg) => {
              console.log(`Message result :(${msg})`);
            }));
          }
          return Promise.all(notifications);
        };
        if ([12, 10, 8, 6, 4, 2, 1].indexOf(element.points) > -1) {
          return sendWBCResult('Selvom du ikke kom i top tre - så fik du da points :-)');
        }
        if (element.points === 25) {
          return sendWBCResult('Tillykke med din første plads :-)');
        }
        if (element.points === 18) {
          return sendWBCResult('Tillykke med din anden plads :-)');
        }
        if (element.points === 15) {
          return sendWBCResult('Tillykke med din tredje plads :-)');
        }
        return sendWBCResult('Æv du fik ingen points  :-(');
      }));
    }
    return Promise.resolve();
  });