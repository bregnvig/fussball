import { DateTime } from 'luxon';
import { Game, Match, PlayerPosition, Position, Team } from './model';

const newMatch = () => ({ team1: 0, team2: 0, goals: [] });
const countVictories = (team: 'team1' | 'team2') => (matches: Match[]) => matches.reduce((acc, match) => acc + (match[team] === 8 ? 1 : 0), 0);
const switchSide = (playerPosition: PlayerPosition): PlayerPosition => ({
  redDefence: playerPosition.blueDefence,
  redOffence: playerPosition.blueOffence,
  blueDefence: playerPosition.redDefence,
  blueOffence: playerPosition.redOffence
});

const nextState = (match: Match, game: Game): Game => {
  if (match.team1 === 8 || match.team2 === 8) {
    const requiredVictories = Math.floor((game.numberOfMatches / 2) + 1);
    const team1Victories = countVictories('team1')(game.matches);
    const team2Victories = countVictories('team2')(game.matches);

    if (team1Victories === requiredVictories || team2Victories === requiredVictories) {
      game.state = 'completed';
    } else {
      game.matches.push(newMatch());
      game.latestPosition = switchSide(game.latestPosition);
    }
  }
  return game;
};

export const goal = (position: Position, game: Game, ownGoal = false): Game => {

  game = { ...game };
  if (!game.matches?.length) {
    game.matches = [newMatch()];
  }

  const player: string = game.latestPosition[position];
  const match: Match = game.matches[game.matches.length - 1];
  const team: Team = game.team1.some(uid => uid === player) ? 'team1' : 'team2';

  match[!ownGoal ? team : (team === 'team1' ? 'team2' : 'team1')] += 1;
  match.goals.push({
    uid: player,
    position,
    time: DateTime.local(),
    team,
    ownGoal
  });

  return nextState(match, game);
};

export const ownGoal = (position: Position, game: Game): Game => {
  return goal(position, game, true);
  // game = { ...game };
  // if (!game.matches?.length) {
  //   game.matches = [newMatch()];
  // }

  // const player: string = game.latestPosition[position];
  // const match: Match = game.matches[game.matches.length - 1];
  // const team: Team = game.team1.some(uid => uid === player) ? 'team1' : 'team2';

  // match[team === 'team1' ? 'team2' : 'team1'] += 1;
  // match.goals.push({
  //   uid: player,
  //   position,
  //   time: DateTime.local(),
  //   team,
  //   ownGoal: true,
  // });

  // return nextState(match, game);
};