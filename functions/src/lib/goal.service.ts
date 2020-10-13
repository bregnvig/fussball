import { DateTime } from 'luxon';
import { Game, Match, PlayerPosition, Position } from './model/game.model';

const newMatch = () => ({ red: 0, blue: 0, goals: [] });
const countVictories = (team: 'red' | 'blue') => (matches: Match[]) => matches.reduce((acc, match) => acc + (match[team] === 8 ? 1 : 0), 0);
const switchSide = (playerPosition: PlayerPosition): PlayerPosition => ({
  redDefence: playerPosition.blueDefence,
  redOffence: playerPosition.blueOffence,
  blueDefence: playerPosition.redDefence,
  blueOffence: playerPosition.redOffence
});

const nextState = (match: Match, game: Game): Game => {
  if (match.blue === 8 || match.red === 8) {
    const requiredVictories = Math.floor((game.numberOfMatches / 2) + 1);
    const redVictories = countVictories('red')(game.matches);
    const blueVictories = countVictories('blue')(game.matches);

    if (blueVictories === requiredVictories || redVictories === requiredVictories) {
      game.state = 'completed';
    } else {
      game.matches.push(newMatch());
      game.latestPosition = switchSide(game.latestPosition);
    }
  }
  return game;
};

export const goal = (position: Position, game: Game): Game => {

  if (!game.matches) {
    game.matches = [newMatch()];
  }

  const player: string = game.latestPosition[position];
  const match: Match = game.matches[game.matches.length - 1];
  const team: 'red' | 'blue' = (['redDefence', 'redOffence'] as Position[]).some(p => p === position) ? 'red' : 'blue';

  match[team] += 1;
  match.goals.push({
    uid: player,
    position,
    time: DateTime.local(),
    team
  });

  return nextState(match, game);
};

export const ownGoal = (position: Position, game: Game): Game => {
  if (!game.matches) {
    game.matches = [newMatch()];
  }

  const player: string = game.latestPosition[position];
  const match: Match = game.matches[game.matches.length - 1];
  const team: 'red' | 'blue' = (['redDefence', 'redOffence'] as Position[]).some(p => p === position) ? 'blue' : 'red';

  match[team] += 1;
  match.goals.push({
    uid: player,
    position,
    time: DateTime.local(),
    team,
    ownGoal: true,
  });

  return nextState(match, game);
};