import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Game, Match, Player, PlayerStat, playerURL, TeamPosition } from '../../lib';

const numberOfGoals = (match: Match, uid: string): number => match.goals.reduce((acc, goal) => acc + goal.uid === uid && !goal.ownGoal ? 1 : 0, 0);
const numberOfOwnGoals = (match: Match, uid: string): number => match.goals.reduce((acc, goal) => acc + goal.uid === uid && goal.ownGoal ? 1 : 0, 0);
const numberOf = (matches: Match[], uid: string, counter: (match: Match, uid: string) => number): number => matches.reduce((acc, match) => acc + counter(match, uid), 0);

const initalStat = (): PlayerStat => ({ won: 0, lost: 0, goals: 0, ownGoals: 0 });

export const playerStatTrigger = functions.region('europe-west1').firestore.document('tables/{tableId}/played/{playedId}')
  .onCreate(async (snapshot: functions.firestore.DocumentSnapshot) => {
    const game: Game = snapshot.data() as Game;
    const winner: TeamPosition = game.matches.reduce((acc, match) => acc + match.team1 === 8 ? 1 : 0, 0) === Math.floor((game.numberOfMatches / 2) + 1) ? 'team1' : 'team2';

    const db = admin.firestore();

    const teamRed = [game.latestPosition.redDefence, game.latestPosition.redOffence];
    const teamBlue = [game.latestPosition.blueDefence, game.latestPosition.blueOffence];

    const createStat = (team: TeamPosition) => (player: Player): PlayerStat => {
      const stat: PlayerStat = { ...player.stat || initalStat() };
      stat.goals = numberOf(game.matches, player.uid, numberOfGoals);
      stat.ownGoals = numberOf(game.matches, player.uid, numberOfOwnGoals);
      stat.won += winner === team ? 1 : 0;
      stat.lost += winner !== team ? 1 : 0;
      return stat;
    };
    return db.runTransaction(async transaction => {
      const createTeam1Stat = createStat('team1');
      teamRed.map(async uid => {
        const snap = await db.doc(playerURL(uid as string)).get();
        transaction.update(snap.ref, { stat: createTeam1Stat(snap.data() as Player) });
      });
      const createTeam2Stat = createStat('team2');
      teamBlue.map(async uid => {
        const snap = await db.doc(playerURL(uid as string)).get();
        transaction.update(snap.ref, { stat: createTeam2Stat(snap.data() as Player) });
      });
      return Promise.resolve();
    });
  });
