import { DateTime } from 'luxon';
import { Game, Match, PlayerPosition, Position, TeamPosition } from './model';

const newMatch = (): Match => ({ team1: 0, team2: 0, goals: [], createdAt: DateTime.local() });
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

  const clonedGame = { ...game };
  if (!clonedGame.matches?.length) {
    clonedGame.matches = [newMatch()];
  }

  const player: string = clonedGame.latestPosition[position] as string;
  const match: Match = clonedGame.matches[clonedGame.matches.length - 1];
  const team: TeamPosition = clonedGame.team1.some(uid => uid === player) ? 'team1' : 'team2';

  match[!ownGoal ? team : (team === 'team1' ? 'team2' : 'team1')] += 1;
  match.goals.push({
    uid: player,
    position,
    time: DateTime.local(),
    team,
    ownGoal
  });

  return nextState(match, clonedGame);
};
