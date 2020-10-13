import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Game, Match, Player, PlayerStat, playerURL, Team } from '../../lib';

const numberOfGoals = (match: Match, uid: string): number => match.goals.reduce((acc, goal) => acc + goal.uid === uid && !goal.ownGoal ? 1 : 0, 0);
const numberOfOwnGoals = (match: Match, uid: string): number => match.goals.reduce((acc, goal) => acc + goal.uid === uid && goal.ownGoal ? 1 : 0, 0);
const numberOf = (matches: Match[], uid: string, counter: (match: Match, uid: string) => number): number => matches.reduce((acc, match) => acc + counter(match, uid), 0);

const initalStat = (): PlayerStat => ({ won: 0, lost: 0, goals: 0, ownGoals: 0 });

export const newPlayerTrigger = functions.region('europe-west1').firestore.document('tables/{tableId}/played/{playedId}')
  .onCreate(async (snapshot: functions.firestore.DocumentSnapshot) => {

    const game: Game = snapshot.data() as Game;
    const winner: Team = game.matches.reduce((acc, match) => acc + match.red === 8 ? 1 : 0, 0) === Math.floor((game.numberOfMatches / 2) + 1) ? 'red' : 'blue';

    const db = admin.firestore();

    const teamRed = [game.latestPosition.redDefence, game.latestPosition.redOffence];
    const teamBlue = [game.latestPosition.blueDefence, game.latestPosition.blueOffence];

    const createStat = (team: Team) => (player: Player): PlayerStat => {
      const stat: PlayerStat = { ...player.stat || initalStat() };
      stat.goals = numberOf(game.matches, player.uid, numberOfGoals);
      stat.ownGoals = numberOf(game.matches, player.uid, numberOfOwnGoals);
      stat.won += winner === team ? 1 : 0;
      stat.lost += winner !== team ? 1 : 0;
      return stat;
    };
    return db.runTransaction(async transaction => {
      const createRedStat = createStat('red');
      teamRed.map(async uid => {
        const snap = await db.doc(playerURL(uid)).get();
        transaction.update(snap.ref, { stat: createRedStat(snap.data() as Player) });
      });
      const createBlueStat = createStat('blue');
      teamBlue.map(async uid => {
        const snap = await db.doc(playerURL(uid)).get();
        transaction.update(snap.ref, { stat: createBlueStat(snap.data() as Player) });
      });
      return Promise.resolve();
    });
  });
