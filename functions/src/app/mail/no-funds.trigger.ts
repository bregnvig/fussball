import * as functions from 'firebase-functions';
import { Player, sendMail } from '../../lib';

  const mailbody = (player: Player) =>
    `<h3>Hej ${player.displayName}</h3>
    <div> 
    <p> Din balance i f2020 spillet er nu nede på ${player.balance}, du kan derfor ikke lægge et bud ind på næste race </br></p>
    <p> Men du kan overfører penge via MobilePay til F1emming på 28 71 22 34</p>
    </div>     
                  
    Wroouumm,<br/>
    F1emming`;
  
export const nofundsTrigger = functions.region('europe-west1').firestore.document('players/{userId}')
    .onUpdate(async (change, context) => {  
      const player: Player  = change.after.data() as Player;
        if ((player.balance || 0) - 20 < -100) {  
          console.log('player', player.displayName ,'has insufficient founds for next race');
          return sendMail(player.email, 'Du kan ikke spille mere', mailbody(player)).then( (msg) => { 
            console.log(`sendMail result :(${msg})`); 
        });
      }
      return null; 
});    